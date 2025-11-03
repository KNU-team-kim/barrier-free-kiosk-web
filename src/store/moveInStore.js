// src/store/moveInStore.js
import { create } from "zustand";

const initial = {
  // Step1
  applicantName: "",
  phone1: "",
  phone2: "",
  phone3: "",
  // Step2
  reasonCategory: "", // 'JOB' | 'STUDY' | 'FAMILY' | 'ETC' 등
  reasonCategoryLabel: "", // 화면 표시용 (선택사항)
  // Step3 (이전 주소 조회 + 수동선택)
  prevAddr: {
    sido: "",
    sigungu: "",
    loading: false,
    error: null,
    result: null, // {sido,sigungu,roadName,buildingNumber,detail} | {notFound:true} | null
  },
  // Step4 (새 주소 입력)
  baseAddress: "", // 도로명 주소 기본(예: roadName)
  buildingType: "", // 지상/지하 등 (선택)
  mainNumber: "", // 본번
  subNumber: "", // 부번
  extraAddress: "", // 상세
  householdMethod: "", // 세대 구성 방법
  // Step5 (부가 서비스)
  services: [],

  // 파생/헬퍼
  loading: false,
  error: null,
};

export const useMoveInStore = create((set, get) => ({
  data: initial,

  reset: () => set({ data: initial }),

  setField: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),

  // prevAddr 내부 특정 필드만 교체
  setPrevAddrField: (key, value) =>
    set((s) => ({
      data: {
        ...s.data,
        prevAddr: { ...s.data.prevAddr, [key]: value },
      },
    })),

  // prevAddr 덩어리 상태 패치
  setPrevAddrState: (patch) =>
    set((s) => ({
      data: { ...s.data, prevAddr: { ...s.data.prevAddr, ...patch } },
    })),

  // 전화번호 조합
  getFullPhone: () => {
    const { phone1, phone2, phone3 } = get().data;
    const p1 = (phone1 || "").trim();
    const p2 = (phone2 || "").trim();
    const p3 = (phone3 || "").trim();
    return [p1, p2, p3].filter(Boolean).join("-");
  },

  buildMoveInPayload: () => {
    const d = get().data;
    const phoneNumber = get().getFullPhone();

    // baseAddress 파싱
    const base = (d.baseAddress || "").trim();
    const parts = base.split(/\s+/); // 띄어쓰기 기준 분리

    // 초기값
    let sido = d.prevAddr?.sido || "";
    let sigungu = d.prevAddr?.sigungu || "";
    let roadName = "";
    let buildingNumber = 0;
    let detailFromBase = "";

    if (parts.length >= 2) {
      sido = parts[0];
      sigungu = parts[1];

      // 세 번째 이후 텍스트 결합
      const rest = parts.slice(2).join(" ");
      // 숫자 앞과 뒤를 분리 (예: "테헤란로 123 삼성빌딩 3층")
      const match = rest.match(/^(.+?)(\d+)(.*)$/);

      if (match) {
        // match[1] = 숫자 앞 문자열, match[2] = 숫자, match[3] = 숫자 뒤 남은 문자열
        roadName = match[1].trim();
        buildingNumber = Number(match[2]);
        detailFromBase = (match[3] || "").trim(); // 숫자 뒤 남은 부분 → detail
      } else {
        // 숫자가 없는 경우
        roadName = rest.trim();
      }
    }

    // detail = baseAddress에서 남은 부분 + extraAddress
    const detail = [detailFromBase, d.extraAddress]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      name: d.applicantName || "",
      phoneNumber,
      reason: d.reasonCategory || "JOB",
      newAddress: {
        sido,
        sigungu,
        roadName,
        buildingNumber,
        detail,
      },
    };
  },
}));
