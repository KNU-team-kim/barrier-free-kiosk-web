import { create } from "zustand";

export const useRegiCertStore = create((set) => ({
  data: {
    idFront: "",
    idBack: "",
    certType: "",
    certDetails: [],
    copies: 0,
  },
  setField: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),
}));
