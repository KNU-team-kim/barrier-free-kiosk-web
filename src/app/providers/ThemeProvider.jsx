import { ThemeProvider as StyledProvider } from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import ThemeModeContext from "../contexts/ThemeModeContext";
import { useMemo, useState } from "react";

const themes = {
  light: {
    colors: {
      deepDark: "#121212",
      dark: "#444444",
      lightGray: "#d9d9d9",
      gray: "#9d9d9d",
      background: "#fafafa",
      white: "#ffffff",
      black: "#000000",
      highlight: "#ff6200",
      label: "#ededed",
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
      deepDark: "#121212",
      dark: "#444444",
      lightGray: "#d9d9d9",
      gray: "#9d9d9d",
      background: "#fafafa",
      white: "#ffffff",
      black: "#000000",
      highlight: "#ff6200",
      label: "#ededed",
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
      <StyledProvider theme={themes[mode]}>
        <GlobalStyle />
        {children}
      </StyledProvider>
    </ThemeModeContext.Provider>
  );
}
