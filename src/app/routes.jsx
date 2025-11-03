import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import KioskLayout from "../layouts/KioskLayout";
import { UIProvider } from "./providers/UIProvider";

import Step1 from "../pages/movein/Step1";
import Step2 from "../pages/movein/Step2";
import Step3 from "../pages/movein/Step3";
import Step4 from "../pages/movein/Step4";
import Step5 from "../pages/movein/Step5";
import RegiStep1 from "../pages/regicert/RegiStep1";
import RegiStep2 from "../pages/regicert/RegiStep2";
import RegiStep3 from "../pages/regicert/RegiStep3";
import RegiStep4 from "../pages/regicert/RegiStep4";
import MoveInComplete from "../pages/movein/MoveInComplete";
import RegiComplete from "../pages/regicert/RegiComplete";

export const router = createBrowserRouter([
  {
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
          { path: "step-3", element: <Step3 /> },
          { path: "step-4", element: <Step4 /> },
          { path: "step-5", element: <Step5 /> },
          { path: "complete", element: <MoveInComplete /> },
        ],
      },
      {
        path: "/regi-cert",
        children: [
          { index: true, element: <Navigate to="step-1" replace /> },
          { path: "step-1", element: <RegiStep1 /> },
          { path: "step-2", element: <RegiStep2 /> },
          { path: "step-3", element: <RegiStep3 /> },
          { path: "step-4", element: <RegiStep4 /> },
          { path: "complete", element: <RegiComplete /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
