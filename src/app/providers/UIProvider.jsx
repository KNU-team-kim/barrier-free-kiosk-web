import { useState, useMemo } from "react";
import UIContext from "../contexts/UIContext";

export function UIProvider({ children }) {
  const [flipped, setFlipped] = useState(false);

  const toggleBigPanel = () => setFlipped((v) => !v);
  const toggleHighContrast = () => {};
  const toggleLargeText = () => {};

  const value = useMemo(
    () => ({
      flipped,
      toggleBigPanel,
      toggleHighContrast,
      toggleLargeText,
    }),
    [flipped]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
