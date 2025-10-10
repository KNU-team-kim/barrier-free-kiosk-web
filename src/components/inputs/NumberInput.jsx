import { useRef } from "react";
import styled from "styled-components";

export default function NumberInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  maxLength = 4,
  align = "left",
  inputRef,
  onBackspaceAtStart,
  onFilled,
  ref: forwardedRef,
  type = "text",
  ...rest
}) {
  const innerRef = useRef(null);

  const attachRef = (node) => {
    innerRef.current = node;

    // React 19 방식 ref
    if (forwardedRef) {
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (typeof forwardedRef === "object") forwardedRef.current = node;
    }

    // 기존 inputRef 옵션도 지원
    if (inputRef) {
      if (typeof inputRef === "function") inputRef(node);
      else if (typeof inputRef === "object") inputRef.current = node;
    }
  };

  const handleChange = (e) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, maxLength);
    onChange?.(next);
    if (onFilled && next.length === maxLength) onFilled(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && (value ?? "").length === 0) {
      onBackspaceAtStart?.();
    }
  };

  return (
    <Input
      ref={attachRef}
      id={id}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      aria-label={ariaLabel}
      inputMode="numeric"
      autoComplete="off"
      $align={align}
      maxLength={maxLength}
      type={type}
      {...rest}
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
