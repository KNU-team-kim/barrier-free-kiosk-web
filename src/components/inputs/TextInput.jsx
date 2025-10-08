import styled from "styled-components";

export default function TextInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  maxLength,
}) {
  // 한글, 영문, 공백만 허용
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <Input
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      maxLength={maxLength}
      inputMode="text"
      autoComplete="off"
    />
  );
}

const Input = styled.input`
  width: 100%;
  padding: 30px 24px;
  outline: none;
  border: 3px solid transparent;
  border-radius: 24px;
  font-size: clamp(40px, 1.4vw, 44px);
  font-weight: 500;
  box-sizing: border-box;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.deepDark};
  &:focus {
    border-color: ${({ theme }) => theme.colors.highlight};
    border-width: 3px;
    outline: none;
  }
`;
