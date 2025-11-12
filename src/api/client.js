import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : `${import.meta.env.VITE_API_BASE_URL}`;

const client = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// 공통 에러 로깅
client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API ERROR]", err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);

export default client;
