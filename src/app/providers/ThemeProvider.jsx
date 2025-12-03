import { ThemeProvider as StyledProvider } from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import ThemeModeContext from "../contexts/ThemeModeContext";
import { useMemo, useState } from "react";

const themes = {
  light: {
    colors: {
      background: "#fafafa",
      belowButton: "#444444",
      highlight: "#ff6200",
      highlightSub: "#444444",
      highlightNormal: "#d9d9d9",
      textContent: "#121212",
      textCaption: "#444444",
      textSub: "#9d9d9d",
      textHighlight: "#FFFFFF",
      label: "#ededed",
      inputBox: "#FFFFFF",
      navigation: "#d9d9d9",
      canSpeakOuter: "#BFE0CB",
      canSpeakInner: "#93CBA7",
      canSpeakHighlight: "#218544",
      cannotSpeakOuter: "#FFD6D6",
      cannotSpeakInner: "#FFB3B3",
      cannotSpeakHighlight: "#FF6B6B",
    },
  },
  high: {
    colors: {
      background: "#000000",
      belowButton: "#FFF982",
      highlight: "#FFF200",
      highlightSub: "#FFF982",
      highlightNormal: "#FFF982",
      textContent: "#FFF200",
      textCaption: "#000000",
      textSub: "#FFF982",
      textHighlight: "#000000",
      label: "#FFF982",
      inputBox: "#FFF200",
      navigation: "#FFF982",
      canSpeakOuter: "#BFE0CB",
      canSpeakInner: "#93CBA7",
      canSpeakHighlight: "#218544",
      cannotSpeakOuter: "#FFD6D6",
      cannotSpeakInner: "#FFB3B3",
      cannotSpeakHighlight: "#FF6B6B",
    },
  },
};

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <StyledProvider
        theme={{
          ...themes[mode],
          mode,
        }}
      >
        <GlobalStyle />
        {children}
      </StyledProvider>
    </ThemeModeContext.Provider>
  );
}
