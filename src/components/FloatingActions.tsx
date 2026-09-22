import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Phone, MessageSquare, Wrench } from "lucide-react";

export const FloatingActions: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="mobile-bottom-quick-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#D9DDE1] px-3 py-2.5 shadow-lg flex items-center justify-between gap-2"
    >
      {/* Call Button */}
      <a
        href="tel:+966572547358"
        id="quick-bar-call"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F5F6F7] hover:bg-[#EEF0F2] text-[#222222] font-bold text-xs py-2.5 px-2 rounded-lg border border-[#D9DDE1] shadow-xs active:scale-98 transition-transform"
      >
        <Phone className="w-4 h-4 text-[#3A3F44]" />
        <span>{t.common.directCall}</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/966572547358?text=${encodeURIComponent(
          isRtl
            ? "السلام عليكم، أحتاج إلى استشارة أو خدمة سباكة."
            : "Hello, I need a plumbing consultation or service."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        id="quick-bar-whatsapp"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-2 rounded-lg shadow-xs active:scale-98 transition-transform"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{t.common.whatsapp}</span>
      </a>

      {/* Request Service */}
      <button
        type="button"
        id="quick-bar-request"
        onClick={scrollToContact}
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#3A3F44] hover:bg-[#222222] text-white font-bold text-xs py-2.5 px-2 rounded-lg shadow-xs active:scale-98 transition-transform"
      >
        <Wrench className="w-3.5 h-3.5" />
        <span>{t.nav.requestService}</span>
      </button>
    </div>
  );
};
