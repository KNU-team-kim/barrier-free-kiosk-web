import HomeContent from "../components/home/HomeContent";
import { useUI } from "../hooks/useUI";

export default function Home() {
  const { toggleHighContrast, toggleLargeText } = useUI();

  return (
    <HomeContent
      onToggleHC={toggleHighContrast}
      onToggleLarge={toggleLargeText}
    />
  );
}
