import styled from "styled-components";

export default function NumberInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  maxLength = 4,
  align = "left",
}) {
  const handleChange = (e) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, maxLength);
    onChange?.(next);
  };

  return (
    <Input
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      inputMode="numeric"
      autoComplete="off"
      $align={align}
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
  padding: 0 16px;
  font-size: clamp(38px, 2vw, 48px);
  font-weight: 500;
  text-align: ${({ $align }) => $align};
  box-sizing: border-box;
  &:focus,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.highlight};
    border-width: 3px;
    outline: none;
  }
`;
