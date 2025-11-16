export const MOVEIN_STEPS = [
  "신원조회",
  "신청내용",
  "발급부수",
  "내용 및 수수료 확인",
];

export const certTypeMap = { SIMPLE: "전체 발급", DETAILED: "선택 발급" };
export const reverseCertTypeMap = Object.fromEntries(
  Object.entries(certTypeMap).map(([k, v]) => [v, k])
);

export const CERT_TYPE_DETAILED_OPTION = [
  "과거의 주소 변동사항",
  "세대 구성 정보",
  "세대 구성원 정보",
  "주민등록번호 뒷자리",
];
