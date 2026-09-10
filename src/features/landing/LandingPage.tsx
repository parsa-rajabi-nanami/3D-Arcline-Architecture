import { CtaSection } from "./components/CtaSection";
import { DesignSection } from "./components/DesignSection";
import { DrawingScene } from "./components/DrawingScene";
import { HeroSection } from "./components/HeroSection";
import { ProcessSection } from "./components/ProcessSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <DesignSection />
        <DrawingScene />
        <ProcessSection />
        <ProjectsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
