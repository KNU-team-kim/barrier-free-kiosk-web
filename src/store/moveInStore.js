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
  reasonCategoryLabel: "", // 화면 표시용
  // Step3 (이전 주소 조회 + 수동선택)
  prevAddr: {
    sido: "",
    sigungu: "",
    roadName: "",
    mainBuildingNumber: "",
    subBuildingNumber: "",
    detail: "",
    loading: false,
    error: null,
    result: "", // {sido,sigungu,roadName,buildingNumber,detail} | {notFound:true} | null
  },
  // Step4 (새 주소 입력)
  newAddr: {
    sido: "", // 시/도
    sigungu: "", // 시/군/구
    roadName: "", // 도로명
    buildingType: "", // 지상/지하
    mainBuildingNumber: "", // 본번
    subBuildingNumber: "", // 부번
    detail: "", // 상세주소
    sedaeju: "", // 세대주 구성방법
  },
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

  // newAddr 내부 특정 필드만 교체
  setNewAddrField: (key, value) =>
    set((s) => ({
      data: {
        ...s.data,
        newAddr: { ...s.data.newAddr, [key]: value },
      },
    })),

  // newAddr 덩어리 상태 패치
  setNewAddrState: (patch) =>
    set((s) => ({
      data: { ...s.data, newAddr: { ...s.data.newAddr, ...patch } },
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

    const sido = d.newAddr?.sido || "";
    const sigungu = d.newAddr?.sigungu || "";
    const roadName = d.newAddr?.roadName || "";
    const mainBuildingNumber = d.newAddr?.mainBuildingNumber || 0;
    const subBuildingNumber = d.newAddr?.subBuildingNumber || 0;
    const detail = d.newAddr?.detail || "";

    return {
      name: d.applicantName || "",
      phoneNumber,
      reason: d.reasonCategory || "JOB",
      newAddress: {
        sido,
        sigungu,
        roadName,
        mainBuildingNumber,
        subBuildingNumber,
        detail,
      },
    };
  },
}));
