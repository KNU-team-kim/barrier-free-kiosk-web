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
  text-align: ${({ $align }) => $align};

  &:focus {
    border-color: ${({ theme }) => theme.colors.highlight};
    border-width: 3px;
    outline: none;
  }
`;
