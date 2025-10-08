export function ensureDaumPostcode() {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.daum && window.daum.Postcode) {
      resolve();
      return;
    }
    const ID = "daum_postcode_script";
    if (document.getElementById(ID)) {
      // 이미 주입 중이라면 onload 대기
      const tag = document.getElementById(ID);
      tag.addEventListener("load", () => resolve(), { once: true });
      tag.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = ID;
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}
