// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: env.VITE_PROXY_TARGET, // ← .env.local에서 읽음
//         changeOrigin: true,
//       },
//     },
//   },
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET, // ← .env.local에서 읽음
          changeOrigin: true,
        },
      },
    },
  };
});
