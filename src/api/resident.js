import client from "./client";

// 주민번호 확인
export async function checkRegistration({ registrationNumber }) {
  const { data } = await client.get("/resident-registration/check", {
    params: { registrationNumber },
  });
  return data; // true / false
}

// 주민등록초본 발급
export async function postRegistration(body) {
  const { data } = await client.post("/resident-registration", body);
  return data;
}
