import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function WizardNav({ onPrev, onNext }) {
  return (
    <NavWrap>
      <Link to="/" aria-label="홈으로">
        <HomeButton type="button">홈</HomeButton>
      </Link>
      {onPrev ? (
        <PrimaryButton type="button" onClick={onPrev} aria-label="이전 단계로">
          <FaAngleLeft aria-hidden="true" />
          <span>이전</span>
        </PrimaryButton>
      ) : (
        <></>
      )}
      {onNext ? (
        <PrimaryButton type="button" onClick={onNext} aria-label="다음 단계로">
          <span>다음</span>
          <FaAngleRight aria-hidden="true" />
        </PrimaryButton>
      ) : (
        <></>
      )}
    </NavWrap>
  );
}

const NavWrap = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap; // 공간이 부족할 때 자동으로 줄바꿈
  min-width: 0;
`;

const HomeButton = styled.button`
  height: 70px;
  padding: 0 24px;
  border-radius: 24px;
  font-size: clamp(24px, 1.8vw, 38px);
  font-weight: 500;

  background: transparent;
  color: ${({ theme }) => theme.colors.deepDark};
  border: 1px solid ${({ theme }) => theme.colors.dark};
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 70px;
  padding: 0 24px;
  border-radius: 24px;
  border: none;
  font-weight: 500;
  font-size: clamp(24px, 1.8vw, 38px);

  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  &[aria-disabled="true"],
`;
