import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, ArrowLeft, PhoneCall } from "lucide-react";
import { motion } from "motion/react";

export const CtaSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="cta" className="bg-[#EEF0F2] py-14 sm:py-20 border-b border-[#D9DDE1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 sm:p-12 border border-[#D9DDE1] shadow-xs"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.cta.title}
          </h2>

          <p className="text-[#666666] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              id="cta-request-service"
              onClick={scrollToContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3A3F44] hover:bg-[#222222] text-white font-bold text-base px-8 py-3.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t.cta.button}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>

            <a
              href="tel:+966572547358"
              id="cta-call-direct"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5F6F7] hover:bg-[#EEF0F2] text-[#222222] font-bold text-base px-6 py-3.5 rounded-lg border border-[#D9DDE1] shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#3A3F44]" />
              <span>+966 57 254 7358</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
