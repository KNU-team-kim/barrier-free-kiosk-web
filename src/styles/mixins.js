import { css } from "styled-components";

export const softCard = css`
  background: #ddd; /* 목업 기본값: 추후 CSS 변수로 치환 */
  color: #111;
  border-radius: 8px;
  border: 1px solid var(--color-border, #d0d0d0);
  box-shadow: 0 0 0 0 transparent;

  &:focus-visible {
    outline: 3px solid var(--focus-ring, #0a66ff);
    outline-offset: 2px;
  }
`;
