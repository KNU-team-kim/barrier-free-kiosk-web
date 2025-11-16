import { create } from "zustand";

const initial = {
  // Step1
  idFront: "",
  idBack: "",

  // Step2
  certType: "", // SIMPLE, DETAILED
  certTypeLabel: "",
  certDetails: [],

  // Step3
  copies: 0,
};

export const useRegiCertStore = create((set, get) => ({
  data: initial,

  reset: () => set({ data: initial }),

  setField: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),

  getFullID: () => {
    const d = get().data;
    return (d.idFront || "") + "-" + (d.idBack || "");
  },

  buildRegiCertPayload: () => {
    const d = get().data;
    return {
      registrationNumber: get().getFullID(),
      type: d.certType,
      copyNumber: d.copies,
    };
  },
}));
