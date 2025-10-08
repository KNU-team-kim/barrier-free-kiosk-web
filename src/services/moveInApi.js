export async function fetchPreviousAddress({ name, phone, sido, sigungu }) {
  // phone은 010-1234-5678 형태로 합쳐 전달
  const payload = { name, phone, sido, sigungu };

  // 실제 서버 붙일 땐 아래 fetch(URL, {method:'POST', body:JSON.stringify(payload)}) 등으로 교체
  // 여기서는 간단한 mock 흐름을 제공 (조회 실패/성공 분기 예시)
  // throw new Error("Network") 등으로 에러도 쉽게 테스트 가능
  const res = await new Promise((resolve) =>
    setTimeout(() => {
      // 간단 Mock: 시군구가 "유"로 시작하면 성공, 아니면 없음
      if (sigungu && sigungu.startsWith("유")) {
        resolve({
          ok: true,
          data: {
            address: `${sido} ${sigungu} 중앙로 123 (101-1201)`,
          },
        });
      } else {
        resolve({ ok: true, data: null }); // 조회결과 없음
      }
    }, 400)
  );

  if (!res.ok) {
    const err = new Error("조회 실패");
    err.response = res;
    throw err;
  }
  return res.data; // null | { address: string }
}
