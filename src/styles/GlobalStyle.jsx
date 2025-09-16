import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 브라우저 기본 스타일 평준화 */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* body 전체에 적용할 스타일 */
  body {
    font-family: 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.fg};
  }

  /* 이미지, 비디오 기본 리셋 */
  img, video {
    max-width: 100%;
    display: block;
  }

  /* 접근성: 포커스가 잘 보이게 */
  :focus {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export default GlobalStyle;
