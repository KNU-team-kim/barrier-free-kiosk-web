import styled from "styled-components";
import useNow from "../../hooks/useNow";

export default function TimeInfo() {
  const now = useNow();

  const fullDateStr = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
  const dateStr = fullDateStr.replace(/\s?([가-힣])요일$/, " ($1)");

  const rawTimeStr = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(now)
    .replace(" ", "")
    .toLowerCase();
  const [timeMain, rawPeriod] = rawTimeStr
    .match(/(\d{1,2}:\d{2})(am|pm)/)
    .slice(1, 3);
  const period = rawPeriod === "am" ? "오전" : "오후";

  return (
    <TimeInfoBox role="timer" aria-live="polite">
      <DateRow>{dateStr}</DateRow>
      <TimeRow>
        <Period>{period}</Period>
        <TimeMain>{timeMain}</TimeMain>
      </TimeRow>
    </TimeInfoBox>
  );
}

const TimeInfoBox = styled.div`
  width: fit-content;
  background: transparent;
  color: ${({ theme }) => theme.colors.deepDark};

  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  align-content: start;
  row-gap: 22px;
  padding: 0px 20px 70px 20px;
  justify-items: center;
`;

const DateRow = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
  margin: 0;
  text-align: left;
`;

const TimeRow = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 0;
  display: grid;
  grid-template-columns: auto auto;
  gap: 18px;
  align-items: end;
  text-align: center;
`;

const TimeMain = styled.span`
  font-size: 96px;
  font-weight: 500;
  line-height: 1;
`;

const Period = styled.span`
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px; /* 살짝 아래로 내려서 baseline 근처 */
  color: ${({ theme }) => theme.colors.dark};
`;
