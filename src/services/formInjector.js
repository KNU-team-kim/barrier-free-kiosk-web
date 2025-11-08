// src/services/formInjector.js
import {
  buildingTypeMap,
  householdFormationTypeMap,
  reasonMap,
  serviceOptionsMap,
} from "../features/movein/config";
import { useMoveInStore } from "../store/moveInStore";

/**
 * step_name → store 필드 매핑 표
 */
const MOVE_IN_STORE_STEP_MAP = {
  name: "applicantName",
  phone_number: "phone", // 특수 처리
  reason: "reasonCategory", // 특수 처리

  before_sido: "prevAddr.sido",
  before_sigungu: "prevAddr.sigungu",

  after_sido: "newAddr.sido",
  after_sigungu: "newAddr.sigungu",
  after_road_name: "newAddr.roadName",
  after_building_type: "newAddr.buildingType", // 특수 처리
  after_building_number_main: "newAddr.mainBuildingNumber",
  after_building_number_sub: "newAddr.subBuildingNumber",
  after_detail_address: "newAddr.detail",
  after_sedaeju: "newAddr.sedaeju", // 특수 처리
  other_service: "services", // 특수 처리
};

/** 숫자만 남기기 */
function digitsOnly(s) {
  return String(s || "").replace(/\D/g, "");
}

/** 휴대전화(보통 10~11자리) → 3-4-4 분해 */
function splitPhoneParts(raw) {
  const d = digitsOnly(raw);
  if (!d) return { p1: "", p2: "", p3: "" };

  if (d.length <= 3) return { p1: d, p2: "", p3: "" };

  // 기본 3-4-4 분해 (10자리면 3-3-4가 될 수 있으나 UI는 3칸이므로 3-4-3도 허용됨)
  const p1 = d.slice(0, 3);
  const midLen = d.length === 10 ? 3 : 4;
  const p2 = d.slice(3, 3 + midLen);
  const p3 = d.slice(3 + midLen);
  return { p1, p2, p3 };
}

/**
 * FormInjector: step_name과 data를 받아 useMoveInStore의 올바른 필드에 자동 주입
 */
export function injectByStepName(stepName, data) {
  const key = String(stepName || "")
    .trim()
    .toLowerCase();
  const field = MOVE_IN_STORE_STEP_MAP[key];
  console.log("[FormInjector] injectByStepName:", {
    stepName: key,
    data,
    field,
  });
  if (!field) return false;

  const { setField, setPrevAddrField, setPrevAddrState, setNewAddrField } =
    useMoveInStore.getState();

  // 특수 처리들
  if (key === "phone_number") {
    const d = String(data ?? "");
    if (!d.trim()) {
      setField("phone1", "");
      setField("phone2", "");
      setField("phone3", "");
    } else {
      const { p1, p2, p3 } = splitPhoneParts(d);
      setField("phone1", p1);
      setField("phone2", p2);
      setField("phone3", p3);
    }
    return true;
  }
  if (key === "reason") {
    const norm = String(data ?? "").trim();
    setField("reasonCategory", norm);
    setField("reasonCategoryLabel", reasonMap[norm] || "");
    return true;
  }

  if (key === "before_sigungu") {
    const {
      sido,
      sigungu,
      roadName,
      mainBuildingNumber,
      subBuildingNumber,
      detail,
    } = data || {};
    const addressStr = [
      sido,
      sigungu,
      roadName,
      mainBuildingNumber != null ? String(mainBuildingNumber) : "",
      subBuildingNumber != null ? String(subBuildingNumber) : "",
      detail || "",
    ]
      .filter(Boolean)
      .join(" ");

    setPrevAddrState({
      sido: sido || "",
      sigungu: sigungu || "",
      roadName: roadName || "",
      mainBuildingNumber: mainBuildingNumber ?? null,
      subBuildingNumber: subBuildingNumber ?? null,
      detail: detail || "",
      loading: false,
      error: null,
      result: { address: addressStr },
    });
    return true;
  }
  if (key === "after_building_type") {
    const norm = String(data ?? "").trim();
    setNewAddrField("buildingType", buildingTypeMap[norm] || "");
    return true;
  }
  if (key === "after_sedaeju") {
    const norm = String(data ?? "").trim();
    setNewAddrField("sedaeju", householdFormationTypeMap[norm] || "");
    return true;
  }
  if (key === "other_service") {
    const raw = Array.isArray(data) ? data : [];
    const mapped = raw.map((code) => serviceOptionsMap[code]).filter(Boolean);
    setField("services", mapped);
    console.log("[FormInjector] injected services:", mapped);
    return true;
  }

  // 일반 처리
  // newAddr/prevAddr 하위 필드 분기
  const isNewAddr = field.startsWith("newAddr.");
  const isPrevAddr = field.startsWith("prevAddr.");

  // 하위 키명 추출 (예: "newAddr.mainBuildingNumber" → "mainBuildingNumber")
  const leaf = field.includes(".") ? field.split(".").slice(-1)[0] : field;

  // 값 정규화 규칙
  //    - null은 null 그대로 유지
  //    - 빈 문자열("")은 그대로 유지
  //    - 숫자 문자열(예: "12")만 Number로 변환
  let value = data;
  if (value === null) {
    // 그대로 null 주입
  } else if (typeof value === "string") {
    const t = value.trim();
    if (t === "") {
      value = ""; // 절대 0으로 변환하지 않음
    } else if (/^\d+$/.test(t)) {
      // 숫자만으로 구성된 문자열인 경우만 숫자 변환
      value = Number(t);
    } else {
      value = t; // 일반 문자열
    }
  } else if (typeof value === "number") {
    // 서버가 숫자를 주면 그대로 유지
  } else if (value === undefined) {
    value = null;
  }

  // 실제 주입
  if (isNewAddr) {
    setNewAddrField(leaf, value);
  } else if (isPrevAddr) {
    setPrevAddrField(leaf, value);
  } else {
    setField(field, value);
  }

  console.log("[FormInjector] injected:", { field, value });
  return true;
}
