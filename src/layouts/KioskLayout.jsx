import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { ScreenDown, ScreenDownPanel } from "../components/ScreenDown";
import { useUI } from "../hooks/useUI";

export default function KioskLayout() {
  const { flipped, toggleBigPanel } = useUI();

  return (
    <Viewport>
      <Screen role="main" aria-label="키오스크 화면" flipped={flipped}>
        {flipped ? (
          <>
            <ScreenDownPanel>
              <ScreenDown
                pressed={flipped}
                onClick={toggleBigPanel}
                label="화면 위로 올리기"
              />
            </ScreenDownPanel>
            <Outlet /> {/* 자식 페이지 콘텐츠 */}
          </>
        ) : (
          <>
            <Outlet />
            <ScreenDownPanel>
              <ScreenDown
                pressed={flipped}
                onClick={toggleBigPanel}
                label="화면 아래로 내리기"
              />
            </ScreenDownPanel>
          </>
        )}
      </Screen>
    </Viewport>
  );
}

/* 1080x1920 고정 뷰포트. 화면 중앙 배치 */
const Viewport = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #111;
`;

/* 실제 키오스크 스크린 */
const Screen = styled.section`
  width: 1080px;
  height: 1920px;
  display: grid;
  grid-template-rows: ${({ flipped }) =>
    flipped ? "1fr 1220px" : "1220px 1fr"};
  gap: 16px;
  box-sizing: border-box;
  background: var(--color-bg, #060748);
  color: var(--color-fg, #fff);
`;
