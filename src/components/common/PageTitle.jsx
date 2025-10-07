import styled from "styled-components";

export default function PageTitle({ children }) {
  return (
    <Title aria-level={1} role="heading">
      {children}
    </Title>
  );
}

const Title = styled.h1`
  font-size: clamp(48px, 3.2vw, 64px); // clamp(최솟값, 선호값, 최댓값) 사용
  line-height: 1.2;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin: 0 0 24px 0;
  overflow-wrap: anywhere; // 줄바꿈 허용
`;
