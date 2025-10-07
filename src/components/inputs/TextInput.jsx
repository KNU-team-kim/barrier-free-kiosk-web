import styled from "styled-components";

export default function TextInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  maxLength,
}) {
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
  border: 3px solid transparent;
  outline: none;
  width: 100%;
  height: 108px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.deepDark};
  padding: 0 20px;
  font-size: clamp(38px, 2vw, 48px);
  font-weight: 500;
  box-sizing: border-box;
  &:focus,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.highlight};
    border-width: 3px;
    outline: none;
  }
`;
