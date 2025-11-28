import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function CompleteView({
  title,
  homeTo = "/",
  homeLabel = "홈으로",
}) {
  const navigate = useNavigate();
  const goHome = () => navigate(homeTo);

  return (
    <Container>
      <Title>{title}</Title>
      <HomeButton onClick={goHome}>{homeLabel}</HomeButton>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 64px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: clamp(42px, 3vw, 64px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.highlightSub};
  text-align: center;
  margin: 0;
`;

const HomeButton = styled.button`
  position: absolute;
  right: 48px;
  bottom: 64px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 70px;
  padding: 0 24px;

  border: none;
  border-radius: 24px;
  font-weight: 500;
  font-size: clamp(32px, 1.8vw, 42px);

  background: ${({ theme }) => theme.colors.highlight};
  color: ${({ theme }) => theme.colors.textHighlight};
  cursor: pointer;
`;
