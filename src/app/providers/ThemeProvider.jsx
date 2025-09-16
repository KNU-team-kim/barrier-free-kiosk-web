import { ThemeProvider as StyledProvider } from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";

const themes = {
  light: { colors: { bg: "#fff", fg: "#111", primary: "#0a7cff" } },
  high: { colors: { bg: "#000", fg: "#fff", primary: "#ffff00" } },
};

export default function ThemeProvider({ children }) {
  const mode = "light"; // state로 바꿔서 토글 가능

  return (
    <StyledProvider theme={themes[mode]}>
      <GlobalStyle />
      {children}
    </StyledProvider>
  );
}
