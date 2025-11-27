import styled from "styled-components";

export default function StepIndicator({ steps = [], current }) {
  return (
    <Wrap aria-label="단계 진행 현황">
      {steps.map((s, idx) => {
        const n = idx + 1;
        const active = n === current;
        return (
          <Item
            key={s}
            data-active={active}
            aria-current={active ? "step" : undefined}
          >
            <Badge aria-hidden="true" data-active={active}>
              {n}
            </Badge>
            <Label data-active={active}>{s}</Label>
          </Item>
        );
      })}
    </Wrap>
  );
}

const Wrap = styled.ol`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  width: 192px;
  height: 173px;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 0; // 내부 줄바꿈 허용

  background: transparent;
  color: ${({ theme }) => theme.colors.textSub};
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.navigation};
    color: ${({ theme }) => theme.colors.textContent};
  }
`;

const Badge = styled.span`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center; // 가로세로 중앙
  border-radius: 50%;
  font-weight: 600;
  font-size: 20px;
  line-height: 1; // 글꼴 메트릭스 여백 최소화
  text-align: center;
  font-variant-numeric: tabular-nums; // 숫자 자폭 균일

  background: ${({ theme }) => theme.colors.textSub};
  color: ${({ theme }) => theme.colors.textHighlight};
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.textContent};
    color: ${({ theme }) => theme.colors.textHighlight};
  }
`;

const Label = styled.span`
  font-size: clamp(28px, 1.6vw, 36px);
  line-height: 1.2;
  text-align: left;
  white-space: normal; // 줄바꿈 허용
  overflow-wrap: break-word; // 단어 단위로 줄바꿈
  word-break: keep-all; // 한글 등은 가능한 공백 기준으로 줄바꿈

  min-width: 0;

  color: ${({ theme }) => theme.colors.textSub};
  &[data-active="true"] {
    color: ${({ theme }) => theme.colors.textContent};
  }
`;
