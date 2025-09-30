import { Link } from "react-router-dom";
import styled from "styled-components";
import { softCard } from "../styles/mixins";

export default function HomeContent({ onToggleHC, onToggleLarge }) {
  return (
    <TopArea>
      <Toolbar aria-label="빠른 설정">
        <ToolButton aria-label="현재 시간 정보">시간정보</ToolButton>
        <ToolButton onClick={onToggleHC} aria-pressed={false}>
          고대비
        </ToolButton>
        <ToolButton aria-label="음성 안내">음성</ToolButton>
        <ToolButton onClick={onToggleLarge} aria-pressed={false}>
          큰글자
        </ToolButton>
      </Toolbar>

      <Actions>
        <ActionButton as="button" aria-label="주민등록등본 발급">
          주민등록등본 발급
        </ActionButton>
        <Link to="/move-in" aria-label="전입신고서 작성으로 이동">
          <ActionButton as="div">전입신고서 작성</ActionButton>
        </Link>
      </Actions>

      <InfoCard role="region" aria-label="공공정보 - 날씨">
        공공정보 - 날씨
      </InfoCard>
    </TopArea>
  );
}

/* ---------- styled ---------- */
const TopArea = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 24px;
`;

const Toolbar = styled.nav`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ToolButton = styled.button`
  ${softCard}
  width: 140px;
  height: 64px;
  font-size: 24px;
  font-weight: 700;
`;

const Actions = styled.section`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  a {
    text-decoration: none;
  }
`;

const ActionButton = styled.button`
  ${softCard}
  width: 360px;
  height: 88px;
  font-size: 28px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const InfoCard = styled.section`
  ${softCard}
  display: grid;
  place-items: center;
  height: 200px;
  font-size: 36px;
  font-weight: 800;
`;
