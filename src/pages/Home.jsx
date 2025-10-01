import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ScreenDown, ScreenDownPanel } from "../components/ScreenDown";
import HomeContent from "../components/home/HomeContent";

export default function Home() {
  const [flipped, setFlipped] = useState(false);

  const onBigActionClick = () => setFlipped((v) => !v);

  const toggleLargeText = () => {};
  const toggleHighContrast = () => {};

  return (
    <Viewport>
      <Screen role="main" aria-label="키오스크 홈 화면" flipped={flipped}>
        {flipped ? (
          <>
            <ScreenDownPanel>
              <ScreenDown
                pressed={flipped}
                onClick={onBigActionClick}
                label="화면 위로 올리기"
              />
            </ScreenDownPanel>
            <HomeContent
              onToggleHC={toggleHighContrast}
              onToggleLarge={toggleLargeText}
            />
          </>
        ) : (
          <>
            <HomeContent
              onToggleHC={toggleHighContrast}
              onToggleLarge={toggleLargeText}
            />
            <ScreenDownPanel>
              <ScreenDown
                pressed={flipped}
                onClick={onBigActionClick}
                label="화면 아래로 내리기"
              />
            </ScreenDownPanel>
          </>
        )}
      </Screen>
    </Viewport>
  );
}

/* 1080x1920 고정 뷰포트. 화면 중앙 배치(개발 중 데스크톱에서도 비율 고정) */
const Viewport = styled.div`
  min-height: 100vh; /* 브라우저 전체 높이 확보 */
  display: grid; /* 2차원 행과 열 레이아웃 시스템 */
  place-items: center; /* 자식요소 행과 열 모두 가운데 배치 */
  background: #111; /* 바깥 여백 확인용 */
`;

/* 실제 키오스크 스크린: 1080x1920 고정 캔버스 */
const Screen = styled.section`
  width: 1080px;
  height: 1920px;
  display: grid;
  grid-template-rows: ${({ flipped }) =>
    flipped
      ? "1fr 1220px"
      : "1220px 1fr"}; /* 행 크기를 정의하는 속성. 상단 1220px 고정, 하단은 나머지. 1fr -> 남은 높이 전부 차지. */
  gap: 16px; /* grid item 사이 간격 */
  box-sizing: border-box; /* padding, border를 width/height에 포함 */
  background: var(--color-bg, #060748); /* 기본 배경 컬러 */
  color: var(--color-fg, #fff); /* 기본 텍스트 컬러 */
`;
