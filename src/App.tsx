import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StatsCounter } from "./components/StatsCounter";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { LeadershipSection } from "./components/LeadershipSection";
import { RatingSection } from "./components/RatingSection";
import { ContactForm } from "./components/ContactForm";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import { AdminPortal } from "./components/AdminPortal";
import { FloatingActions } from "./components/FloatingActions";

export function AppContent() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check if URL is /admin or #admin
  useEffect(() => {
    const checkPath = () => {
      if (
        window.location.pathname === "/admin" ||
        window.location.hash === "#admin"
      ) {
        setIsAdminOpen(true);
      }
    };
    checkPath();
    window.addEventListener("popstate", checkPath);
    window.addEventListener("hashchange", checkPath);
    return () => {
      window.removeEventListener("popstate", checkPath);
      window.removeEventListener("hashchange", checkPath);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    window.history.pushState(null, "", "#admin");
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === "#admin" || window.location.pathname === "/admin") {
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col font-sans selection:bg-[#3A3F44] selection:text-white pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar onOpenAdmin={handleOpenAdmin} isAdminOpen={isAdminOpen} />

      {/* Main Content Sections in exact required hierarchy */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Company Trust Statistics */}
        <StatsCounter />

        {/* 3. About Section */}
        <AboutSection />

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. Projects Section */}
        <ProjectsSection />

        {/* 6. Why Choose Us */}
        <WhyChooseUs />

        {/* 7. Experience / Leadership */}
        <LeadershipSection />

        {/* 8. Customer Satisfaction Rating */}
        <RatingSection />

        {/* 9. Service Request Form */}
        <ContactForm />

        {/* 10. Call to Action Banner */}
        <CtaSection />
      </main>

      {/* 11. Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Admin Portal Modal / Route Handler */}
      <AdminPortal isOpen={isAdminOpen} onClose={handleCloseAdmin} />

      {/* Mobile Floating Quick Action Bar */}
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
