import ThemeProvider from "./providers/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
