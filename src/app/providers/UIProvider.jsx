import { useState, useMemo, useCallback } from "react";
import UIContext from "../contexts/UIContext";
import useThemeMode from "../../hooks/useThemeMode";

export function UIProvider({ children }) {
  const [flipped, setFlipped] = useState(false);
  const { mode, setMode } = useThemeMode();

  const toggleBigPanel = useCallback(() => setFlipped((v) => !v), []);
  const toggleHighContrast = useCallback(
    () => setMode((prev) => (prev === "high" ? "light" : "high")),
    [setMode]
  );

  const value = useMemo(
    () => ({
      flipped,
      mode,
      toggleBigPanel,
      toggleHighContrast,
    }),
    [flipped, mode, toggleBigPanel, toggleHighContrast]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
