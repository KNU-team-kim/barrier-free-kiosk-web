import styled from "styled-components";

export default function LabelText({ children, className }) {
  return <Label className={className}>{children}</Label>;
}

const Label = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  // display grid의 자식요소는 justify-self가 stretch가 기본값.
  // 즉 그리드 셀 안에서 가로 폭을 부모 셀 전체로 늘려버림.
  // 그래서 셀 안에서 가로 방향으로 내용 크기만큼만 차지하고, 왼쪽에 붙이라는 justify-self start 사용.
  justify-self: start;

  background-color: ${({ theme }) => theme.colors.label};
  color: ${({ theme }) => theme.colors.textCaption};

  font-size: clamp(38px, 1.4vw, 42px);
  font-weight: 400;
  line-height: 1;
  border-radius: 14px;

  padding: 20px 15px;
  text-align: center;
`;
