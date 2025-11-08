// src/api/moveIn.js
import client from "./client";

// 전입신고 이력 확인
export async function checkMoveIn({ phoneNumber, name }) {
  const { data } = await client.get("/move-in/check", {
    params: { phoneNumber, name },
  });
  return data; // true / false
}

// 등록 주소 가져오기
export async function getMoveInAddress({ phoneNumber, name }) {
  console.log("API CALL: getMoveInAddress", { phoneNumber, name });
  const { data } = await client.get("/move-in/address", {
    params: { phoneNumber, name },
  });
  return data; // { sido, sigungu, roadName, mainBuildingNumber, subBuildingNumber, detail }
}

// 전입신고 제출
export async function postMoveIn(body) {
  const { data } = await client.post("/move-in", body);
  return data;
}
