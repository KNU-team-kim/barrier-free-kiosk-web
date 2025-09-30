import styled from "styled-components";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

export function ScreenDownPanel({ children }) {
  return <Panel>{children}</Panel>;
}

export function ScreenDown({ pressed, onClick, label = "낮은화면용 버튼" }) {
  return (
    <BigButton
      type="button"
      onClick={onClick}
      aria-pressed={pressed} // 접근성: 버튼 상태 알림
      aria-label={label} // 접근성: 버튼 역할과 상태 알림
    >
      {pressed ? (
        <FaAngleDoubleUp size={36} />
      ) : (
        <FaAngleDoubleDown size={36} />
      )}
      {label}
      {pressed ? (
        <FaAngleDoubleUp size={36} />
      ) : (
        <FaAngleDoubleDown size={36} />
      )}
    </BigButton>
  );
}

const Panel = styled.div`
  display: grid; /* 중앙 정렬용 */
`;

const BigButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: #252552; // 버튼 배경색
  color: #fff; // 버튼 글자색
  display: flex;
  justify-content: center; // 가로 중앙 정렬
  align-items: center; // 세로 중앙 정렬
  gap: 12px;
  font-size: 40px;
  font-weight: 500;
`;
