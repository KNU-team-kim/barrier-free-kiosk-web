import { ThemeProvider as StyledProvider } from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";

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
    },
  },
};

export default function ThemeProvider({ children }) {
  const mode = "light"; // 추후 state로 교체 가능

  return (
    <StyledProvider theme={themes[mode]}>
      <GlobalStyle />
      {children}
    </StyledProvider>
  );
}
