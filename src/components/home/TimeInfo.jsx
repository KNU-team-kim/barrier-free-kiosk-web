import styled from "styled-components";
import useNow from "../../hooks/useNow";

export default function TimeInfo() {
  const now = useNow();

  const dateStr = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);

  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(now)
    .replace(" ", "")
    .toLowerCase();

  return (
    <TimeInfoBox role="timer" aria-live="polite">
      <DateRow>{dateStr}</DateRow>
      <TimeRow>{timeStr}</TimeRow>
    </TimeInfoBox>
  );
}

const TimeInfoBox = styled.div`
  width: fit-content;
  height: 180px;
  background: transparent;
  color: #fff;

  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  align-content: start;
  row-gap: 15px;
  justify-items: left;
`;

const DateRow = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
  margin: 0;
  text-align: left;
`;

const TimeRow = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 82px;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  text-align: left;
`;
