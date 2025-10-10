import { FaArrowLeft } from "react-icons/fa6";
import styled from "styled-components";

export default function NumericPad({ onInput, onDelete }) {
  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "del"],
  ];

  return (
    <PadWrap>
      {rows.map((row, rIdx) => (
        <Row key={rIdx}>
          {row.map((key) =>
            key === "" ? (
              <EmptyCell key="empty" />
            ) : (
              <KeyButton
                key={key}
                onClick={() => (key === "del" ? onDelete?.() : onInput?.(key))}
                data-type={key === "del" ? "del" : "num"}
              >
                {key === "del" ? <FaArrowLeft aria-hidden /> : key}
              </KeyButton>
            )
          )}
        </Row>
      ))}
    </PadWrap>
  );
}

const PadWrap = styled.div`
  display: grid;
  gap: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  justify-content: center;
`;

const KeyButton = styled.button`
  background: ${({ theme }) => theme.colors.gray};
  color: ${({ theme }) => theme.colors.white};
  font-size: 40px;
  font-weight: 500;
  border: none;
  border-radius: 24px;
  padding: 30px 24px;
  display: grid;
  place-items: center;
  cursor: pointer;

  &[data-type="del"] {
    background: transparent;
    color: ${({ theme }) => theme.colors.gray};
    border: 2px solid ${({ theme }) => theme.colors.gray};
  }

  &:active {
    background: ${({ theme }) => theme.colors.dark};
  }
`;

const EmptyCell = styled.div`
  min-width: 170px;
`;
