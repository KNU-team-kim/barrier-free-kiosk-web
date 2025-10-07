import create from "zustand";

export const useMoveInStore = create((set, get) => ({
  data: {
    applicantName: "",
    phone1: "",
    phone2: "",
    phone3: "",
  },

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
}));
