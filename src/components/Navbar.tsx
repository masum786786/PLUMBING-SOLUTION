import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Menu, X, Phone, Shield, ArrowRight, ArrowLeft } from "lucide-react";

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminOpen }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.experience, href: "#leadership" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (isAdminOpen) {
      // scroll after closing admin if needed
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      id="navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#D9DDE1]"
          : "bg-white border-b border-[#D9DDE1]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo */}
          <a
            href="#hero"
            id="brand-logo-link"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none min-w-0"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("#hero");
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#3A3F44] text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <span className="text-sm sm:text-base tracking-tighter">PS</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-lg lg:text-xl tracking-tight text-[#222222] group-hover:text-[#3A3F44] transition-colors truncate">
                PLUMBING SOLUTION
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#8A8F94] font-medium tracking-wide uppercase truncate">
                {language === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                id={`desktop-nav-${link.href.replace("#", "")}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3.5 py-2 text-sm font-medium text-[#3A3F44] hover:text-[#222222] hover:bg-[#F5F6F7] rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Admin trigger */}
            <button
              id="desktop-nav-admin"
              onClick={onOpenAdmin}
              className="px-3.5 py-2 text-sm font-medium text-[#3A3F44] hover:text-[#222222] hover:bg-[#F5F6F7] rounded-md transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-[#8A8F94]" />
              {t.nav.admin}
            </button>
          </nav>

          {/* Desktop Right Actions: Language Selector & CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div
              id="language-switcher-desktop"
              className="flex items-center bg-[#F5F6F7] border border-[#D9DDE1] rounded-lg p-1 text-xs font-semibold"
            >
              <button
                type="button"
                id="lang-btn-en"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === "en"
                    ? "bg-white text-[#222222] shadow-xs font-bold"
                    : "text-[#666666] hover:text-[#222222]"
                }`}
              >
                EN
              </button>
              <span className="text-[#D9DDE1] px-0.5">|</span>
              <button
                type="button"
                id="lang-btn-ar"
                onClick={() => setLanguage("ar")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === "ar"
                    ? "bg-white text-[#222222] shadow-xs font-bold"
                    : "text-[#666666] hover:text-[#222222]"
                }`}
              >
                العربية
              </button>
            </div>

            {/* Primary CTA */}
            <a
              href="#contact"
              id="navbar-cta-button"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("#contact");
              }}
              className="inline-flex items-center gap-2 bg-[#3A3F44] hover:bg-[#222222] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-all hover:shadow hover:-translate-y-0.5"
            >
              <span>{t.nav.requestService}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>

          {/* Mobile & Tablet Right Icons (Language & Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            {/* Mobile Language Switcher Pill */}
            <div
              id="language-switcher-mobile"
              className="flex items-center bg-[#F5F6F7] border border-[#D9DDE1] rounded-lg p-0.5 text-xs font-bold"
            >
              <button
                type="button"
                id="lang-btn-mobile-en"
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  language === "en"
                    ? "bg-white text-[#222222] shadow-xs font-bold"
                    : "text-[#666666]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                id="lang-btn-mobile-ar"
                onClick={() => setLanguage("ar")}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  language === "ar"
                    ? "bg-white text-[#222222] shadow-xs font-bold"
                    : "text-[#666666]"
                }`}
              >
                عربي
              </button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#3A3F44] hover:text-[#222222] hover:bg-[#F5F6F7] active:bg-[#EEF0F2] rounded-lg border border-[#D9DDE1] focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden border-b border-[#D9DDE1] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                id={`mobile-nav-${link.href.replace("#", "")}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-4 py-3 min-h-[44px] text-sm sm:text-base font-semibold text-[#3A3F44] hover:text-[#222222] hover:bg-[#F5F6F7] rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 text-[#8A8F94]" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#8A8F94]" />
                )}
              </a>
            ))}

            {/* Admin button in mobile menu */}
            <button
              type="button"
              id="mobile-nav-admin"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="px-4 py-3 min-h-[44px] text-sm sm:text-base font-semibold text-[#3A3F44] hover:text-[#222222] hover:bg-[#F5F6F7] rounded-lg transition-colors flex items-center justify-between text-left rtl:text-right w-full"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8A8F94]" />
                {t.nav.admin}
              </span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4 text-[#8A8F94]" />
              ) : (
                <ArrowRight className="w-4 h-4 text-[#8A8F94]" />
              )}
            </button>
          </div>

          <div className="pt-3 border-t border-[#D9DDE1] flex flex-col gap-2.5">
            {/* Direct Call Button */}
            <a
              href="tel:+966572547358"
              id="mobile-call-action"
              className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#F5F6F7] hover:bg-[#EEF0F2] text-[#222222] font-semibold py-3 px-4 rounded-lg border border-[#D9DDE1] text-xs sm:text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-[#3A3F44]" />
              <span>+966 57 254 7358 ({language === "ar" ? "اتصال مباشر" : "Direct Call"})</span>
            </a>

            {/* Request Service button */}
            <a
              href="#contact"
              id="mobile-request-cta"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("#contact");
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#3A3F44] hover:bg-[#222222] text-white font-bold py-3 px-4 rounded-lg shadow-sm text-xs sm:text-sm transition-colors"
            >
              <span>{t.nav.requestService}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
