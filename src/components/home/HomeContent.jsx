import { Link } from "react-router-dom";
import styled from "styled-components";
import { softCard } from "../../styles/mixins";
import TimeInfo from "./TimeInfo";

export default function HomeContent({ onToggleHC, onToggleLarge }) {
  return (
    <TopArea>
      <Toolbar aria-label="빠른 설정">
        <TimeInfo />
        <ToolButtonGroup>
          <ToolButton onClick={onToggleHC} aria-pressed={false}>
            고대비
          </ToolButton>
          <ToolButton aria-label="음성 안내">음성</ToolButton>
          <ToolButton onClick={onToggleLarge} aria-pressed={false}>
            큰글자
          </ToolButton>
        </ToolButtonGroup>
      </Toolbar>

      <Actions>
        <Link to="/move-in" aria-label="주민등록등본 발급으로 이동">
          <ActionButton as="div">주민등록등본 발급</ActionButton>
        </Link>
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
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
`;

const Toolbar = styled.nav`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start; // 좌, 우 요소 높이가 달라도 자연스럽게 하기위해 설정.
`;

const ToolButtonGroup = styled.div`
  margin-left: auto; // 이 한 줄로 오른쪽 정렬
  display: flex;
  gap: 16px;
  flex-wrap: wrap; // 필요 시 다음 줄로 내려가도록
  align-items: center;
`;

const ToolButton = styled.button`
  ${softCard}
  width: 140px;
  height: 64px;
  font-size: 24px;
  font-weight: 500;
`;

const Actions = styled.section`
  display: flex;
  flex-wrap: wrap; // 한 줄에 다 못들어가는 아이템은 줄바꿈.
  gap: 24px; // 아이템 사이 간격
  justify-content: space-between; // 아이템들을 양 끝으로 정렬하고, 남는 공간을 아이템 사이에 균등 분배.

  /* 자식이 a 태그일 때 */
  a {
    text-decoration: none;
    display: block; // Link 컴포넌트는 기본적으로 inline 요소이므로 block으로 변경.
    flex: 1 1 calc((100% - 24px) / 2); // 전체 폭 100%에서 gap(24px)만큼 뺀 후 2등분.
    /* 1 1 calc: flex-grow flex-shrink flex-basis. 얼마만큼 늘어들지 비율, 얼마만큼 줄어들지 비율, 얼마나 차지할지 비율. */
  }
`;

const ActionButton = styled.button`
  ${softCard}
  width: 100%;
  height: 88px;
  font-size: 28px;
  font-weight: 500;
  display: grid;
  place-items: center;
`;

const InfoCard = styled.section`
  ${softCard}
  display: grid;
  place-items: center;
  height: 200px;
  font-size: 36px;
  font-weight: 500;
  margin-top: auto; // 요소를 가능한 아래쪽 끝으로 내림
`;
