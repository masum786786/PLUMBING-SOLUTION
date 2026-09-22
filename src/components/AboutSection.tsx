import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { CheckCircle2, Award, Building, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export const AboutSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const highlights = [
    t.about.h1,
    t.about.h2,
    t.about.h3,
    t.about.h4,
    t.about.h5,
  ];

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="about" className="bg-white py-14 sm:py-20 lg:py-24 border-b border-[#D9DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Image on Desktop, responsive on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-2 lg:order-1 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#D9DDE1] shadow-md bg-[#F5F6F7] p-2">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] rounded-xl overflow-hidden bg-[#EEF0F2]">
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80"
                  alt="Plumbing Solution engineers inspecting mechanical pipe network in Saudi Arabia"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80") {
                      target.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/50 via-transparent to-transparent" />
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:left-5 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-[#D9DDE1] shadow-lg flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg bg-[#3A3F44] text-white flex items-center justify-center font-extrabold text-xl shrink-0">
                  25+
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A8F94]">
                    {t.about.experienceBadgeText}
                  </span>
                  <span className="text-sm font-extrabold text-[#222222]">
                    {isRtl ? "جودة معتمدة في المملكة" : "Proven Industry Heritage"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content on Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 order-1 lg:order-2 text-left rtl:text-right"
          >
            <div className="inline-flex items-center gap-2 bg-[#F5F6F7] border border-[#D9DDE1] rounded-full px-3 py-1 mb-4">
              <Award className="w-3.5 h-3.5 text-[#3A3F44]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
                {t.about.eyebrow}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-6">
              {t.about.title}
            </h2>

            <p className="text-[#3A3F44] text-base sm:text-lg leading-relaxed mb-4 font-normal">
              {t.about.p1}
            </p>

            <p className="text-[#666666] text-sm sm:text-base leading-relaxed mb-8">
              {t.about.p2}
            </p>

            {/* Highlights list */}
            <div className="bg-[#F5F6F7] rounded-xl p-5 sm:p-6 border border-[#D9DDE1] mb-8">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#222222] mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#3A3F44]" />
                <span>{t.about.highlightsTitle}</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3A3F44] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-[#3A3F44]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              id="about-cta-consult"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 bg-[#3A3F44] hover:bg-[#222222] text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5 text-sm"
            >
              <span>{t.about.readMore}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
