import { Link } from "react-router-dom";
import styled from "styled-components";
import { softCard } from "../../styles/mixins";
import TimeInfo from "./TimeInfo";
import useThemeMode from "../../hooks/useThemeMode";
import { FaCheck } from "react-icons/fa6";

export default function HomeContent({ onToggleHC, onToggleLarge }) {
  const { mode, setMode } = useThemeMode();

  const isLight = mode === "light";
  const isHigh = mode === "high";

  return (
    <HomeWrap>
      <Toolbar aria-label="화면 모드 설정">
        <ToolButton
          onClick={() => setMode("light")}
          aria-pressed={isLight}
          data-active={isLight}
          aria-label="일반 모드"
        >
          {isLight && <FaCheck aria-hidden="true" />}
          일반
        </ToolButton>
        <ToolButton
          onClick={() => setMode("high")}
          aria-pressed={isHigh}
          data-active={isHigh}
          aria-label="고대비 모드"
        >
          {isHigh && <FaCheck aria-hidden="true" />}
          고대비
        </ToolButton>
        <ToolButton
          onClick={onToggleLarge}
          aria-pressed={false}
          data-active={false}
          aria-label="큰글자 모드"
        >
          큰글자
        </ToolButton>
        <ToolButton aria-label="음성 안내" data-active={false}>
          음성
        </ToolButton>
      </Toolbar>
      <Divider role="separator" aria-hidden />
      <TimeInfo />

      <Actions>
        <ActionItem align="right">
          <Link to="/regi-cert/step-1" aria-label="주민등록등본 발급으로 이동">
            <ActionButton>
              <IconWrap>
                <IconCircle>🖨️</IconCircle>
              </IconWrap>
              <Label>
                주민등록등본
                <br />
                발급하기
              </Label>
            </ActionButton>
          </Link>
        </ActionItem>

        <ActionItem align="left">
          <Link to="/move-in/step-1" aria-label="전입신고서 작성으로 이동">
            <ActionButton>
              <IconWrap>
                <IconCircle>🖊️</IconCircle>
              </IconWrap>
              <Label>
                전입신고서
                <br />
                작성하기
              </Label>
            </ActionButton>
          </Link>
        </ActionItem>
      </Actions>

      <InfoCard role="region" aria-label="공공정보 - 날씨"></InfoCard>
    </HomeWrap>
  );
}

const HomeWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 32px 24px;
`;

/* Top Toolbar */
const Toolbar = styled.nav`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ToolButton = styled.button`
  padding: 10px 20px;
  min-width: 140px;
  font-size: 38px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  color: ${({ theme }) => theme.colors.deepDark};
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: 24px;
  &[data-active="true"] {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.dark};
    border-color: transparent;
  }
`;

/* Main Buttons */
const Actions = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  /* 자식이 a 태그일 때 */
  a {
    text-decoration: none;
    display: block; // Link 컴포넌트는 기본적으로 inline 요소이므로 block으로 변경.
    flex: 1 1 calc((100% - 24px) / 2); // 전체 폭 100%에서 gap(24px)만큼 뺀 후 2등분.
    /* 1 1 calc: flex-grow flex-shrink flex-basis. 얼마만큼 늘어들지 비율, 얼마만큼 줄어들지 비율, 얼마나 차지할지 비율. */
  }
`;

const ActionItem = styled.div`
  display: flex;
  justify-content: ${({ align }) =>
    align === "right" ? "flex-end" : "flex-start"};
`;

const ActionButton = styled.button`
  width: 100%;
  max-width: 360px;
  min-height: 388px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;

  border: 1px solid ${({ theme }) => theme.colors.deepDark};
  border-radius: 24px;
  background: transparent;
  color: ${({ theme }) => theme.colors.deepDark};
  font-size: 40px;
  font-weight: 500;
  line-height: 1.2;
  padding: 40px;
  text-align: center;

  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.lightGray};
  }
`;

// 아이콘 배경 원
const IconWrap = styled.div`
  flex: 1; /* 아이콘 위쪽 여백 확보 */
  display: flex;
  align-items: flex-start;
  justify-content: left;
`;

const IconCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.label};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: ${({ theme }) => theme.colors.deepDark};
`;

// 텍스트는 버튼 하단 중앙에
const Label = styled.div`
  display: flex;
  align-items: flex-end;
  text-align: left;
  line-height: 1.2;
`;

/* Info Card */
const InfoCard = styled.section`
  ${softCard}
  display: grid;
  place-items: center;
  height: 200px;
  font-size: 36px;
  font-weight: 500;
  margin-top: auto; // 요소를 가능한 아래쪽 끝으로 내림
`;

const Divider = styled.hr`
  margin: 32px 0;
  height: 1px;
  border: 0;
  background: ${({ theme }) => theme.colors.lightGray};
`;
