import styled from "styled-components";

export default function SelectInput({
  value,
  onChange,
  options = [],
  disabled = false,
  ariaLabel,
  placeholder = "선택하세요",
}) {
  return (
    <Field>
      <Select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
    </Field>
  );
}

const Field = styled.div`
  display: grid;
  gap: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 30px 24px;
  outline: none;
  border: 3px solid transparent;
  border-radius: 24px;
  font-size: clamp(40px, 1.4vw, 44px);
  font-weight: 500;
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.deepDark};

  // 기본 화살표 제거
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  // 커스텀 화살표 (SVG 삽입)
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 24px center; // 오른쪽 여백
  background-size: 32px 32px; // 화살표 크기

  &:disabled {
    background-color: ${({ theme }) => theme.colors.label};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.black};
    cursor: not-allowed;
  }
`;
