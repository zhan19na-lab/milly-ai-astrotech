import NebulaBackground from "@/components/nebula-background";
import HeroSection from "@/components/hero-section";
import BentoGrid from "@/components/bento-grid";

// Server Component — импортирует три клиентских острова
export default function HomePage() {
  return (
    <>
      {/* Фиксированный фон с небула-орбами (position: fixed, z-0) */}
      <NebulaBackground />

      {/* Основной контент поверх фона */}
      <main className="relative z-10 overflow-x-hidden">
        <HeroSection />
        <BentoGrid />
      </main>
    </>
  );
}
