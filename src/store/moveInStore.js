import { create } from "zustand";

const initial = {
  applicantName: "",
  phone1: "",
  phone2: "",
  phone3: "",
  reasonCategory: "",
  services: [],
  prevAddr: {
    sido: "",
    sigungu: "",
    loading: false,
    error: null,
    result: null, // null | { address: string } | { notFound: true }
  },
};

export const useMoveInStore = create((set, get) => ({
  data: initial,

  // 필드 변경
  // ...s.data -> 기존 데이터 복사
  // [key]: value -> key에 해당하는 필드만 value로 변경
  setField: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),

  // 다음 단계로 넘어갈 때 유효성 검사 등에서 사용
  validateStep1: () => {
    const { applicantName, phone1, phone2, phone3 } = get().data;
    return (
      applicantName.trim().length > 0 &&
      phone1.length >= 2 &&
      phone2.length >= 3 &&
      phone3.length >= 3
    );
  },

  setPrevAddrField: (key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        prevAddr: { ...state.data.prevAddr, [key]: value },
      },
    })),

  setPrevAddrState: (patch) =>
    set((state) => ({
      data: { ...state.data, prevAddr: { ...state.data.prevAddr, ...patch } },
    })),

  // 전화번호 합쳐서 반환
  getFullPhone: () => {
    const { phone1, phone2, phone3 } = get().data;
    const p1 = (phone1 || "").trim();
    const p2 = (phone2 || "").trim();
    const p3 = (phone3 || "").trim();
    return [p1, p2, p3].filter(Boolean).join("-");
  },
}));
