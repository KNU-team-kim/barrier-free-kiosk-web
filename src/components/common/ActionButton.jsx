import styled from "styled-components";

export default function ActionButton({
  type = "button",
  disabled,
  onClick,
  children,
}) {
  return (
    <Button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

const Button = styled.button`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  width: 100%;
  padding: 30px 24px;
  outline: none;
  border: 3px solid transparent;
  border-radius: 24px;
  font-size: clamp(40px, 1.4vw, 44px);
  font-weight: 500;
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.colors.highlight};
  color: ${({ theme }) => theme.colors.deepDark};

  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
