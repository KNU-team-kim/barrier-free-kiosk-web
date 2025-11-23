export const MOVEIN_STEPS = [
  "신원조회",
  "신청내용",
  "발급부수",
  "내용 및 수수료 확인",
];

export const certTypeMap = { SIMPLE: "선택 발급", DETAILED: "전체 발급" };
export const reverseCertTypeMap = Object.fromEntries(
  Object.entries(certTypeMap).map(([k, v]) => [v, k])
);
