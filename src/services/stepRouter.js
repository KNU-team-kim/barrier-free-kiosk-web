/**
 * move-in 시나리오 전용 step_name -> 페이지 경로 매핑
 * 페이지 구조: Step1 ~ Step5 + Complete
 */
const MAP = {
  // Home
  home: "/",

  // Step1
  name: "/move-in/step-1",
  phone_number: "/move-in/step-1",

  // Step2
  reason: "/move-in/step-2",

  // Step3
  before_sido: "/move-in/step-3",
  before_sigungu: "/move-in/step-3",

  // Step4
  after_sido: "/move-in/step-4",
  after_sigungu: "/move-in/step-4",
  after_road_name: "/move-in/step-4",
  after_building_type: "/move-in/step-4",
  after_building_number_main: "/move-in/step-4",
  after_building_number_sub: "/move-in/step-4",
  after_detail_address: "/move-in/step-4",
  after_sedaeju: "/move-in/step-4",

  // Step5
  other_service: "/move-in/step-5",
  // 완료
  complete_move_in: "/move-in/complete",
};

/**
 * step_name을 받아 매핑된 경로(문자열) 반환
 * 매핑이 없으면 null 반환
 */
export function getPathByStepName(stepName) {
  const key = String(stepName || "")
    .trim()
    .toLowerCase();
  return MAP.hasOwnProperty(key) ? MAP[key] : null;
}

/**
 * react-router의 navigate 함수를 받아 해당 step으로 이동
 * - 사용 예: routeByStepName(navigate, step_name)
 * - 이동 대상이 없으면 아무것도 하지 않음
 */
export function routeByStepName(navigate, stepName) {
  const path = getPathByStepName(stepName);
  if (path && typeof navigate === "function") {
    navigate(path);
    return true;
  }
  return false;
}

/**
 * 유효한 step_name인지 확인 (불필요하면 제거 가능)
 */
export function isValidStepName(stepName) {
  const key = String(stepName || "")
    .trim()
    .toLowerCase();
  return MAP.hasOwnProperty(key);
}
