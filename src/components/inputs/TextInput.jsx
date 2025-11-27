import styled from "styled-components";

export default function TextInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  maxLength,
  ref,
}) {
  // 한글, 영문, 공백만 허용
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };
  console.log("TextInput rendered with ref:", ref);

  return (
    <Input
      id={id}
      ref={ref || null}
      value={value ?? ""}
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

  background: ${({ theme }) => theme.colors.inputBoxBackground};
  color: ${({ theme }) => theme.colors.textContent};
  &:focus {
    border-color: ${({ theme }) => theme.colors.highlight};
    border-width: 3px;
    outline: none;
  }
`;
