import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Step1 from "../pages/movein/Step1";
import KioskLayout from "../layouts/KioskLayout";
import { UIProvider } from "./providers/UIProvider";
import Step2 from "../pages/movein/Step2";

export const router = createBrowserRouter([
  {
    // 공용 레이아웃(Viewport/Screen/ScreenDown)
    element: (
      <UIProvider>
        <KioskLayout />
      </UIProvider>
    ),
    children: [
      { path: "/", element: <Home /> }, // 홈
      {
        path: "/move-in",
        // element: <MoveInLayout />,      // 선택: 전입신고 전용 레이아웃(사이드 스텝퍼 등)
        children: [
          { index: true, element: <Navigate to="step-1" replace /> },
          { path: "step-1", element: <Step1 /> },
          { path: "step-2", element: <Step2 /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
