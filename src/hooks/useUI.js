import { useContext } from "react";
import UIContext from "../app/contexts/UIContext";

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
