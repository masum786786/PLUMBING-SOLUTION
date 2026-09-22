import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, ArrowLeft, Award, CheckCircle, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "motion/react";

export const Hero: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative bg-[#F5F6F7] pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24 overflow-hidden border-b border-[#D9DDE1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col text-left rtl:text-right"
          >
            {/* National Trust Pill */}
            <div className="inline-flex items-center gap-2 self-start bg-white border border-[#D9DDE1] rounded-full px-3.5 py-1.5 shadow-xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-[#3A3F44] tracking-wide">
                {t.hero.tag}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-main-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-5xl font-extrabold text-[#222222] tracking-tight leading-[1.18] mb-4"
            >
              {t.hero.title}
            </h1>

            {/* Subheading */}
            <div
              id="hero-subheading"
              className="text-base sm:text-lg md:text-xl font-bold text-[#3A3F44] mb-4 flex items-center gap-2 flex-wrap"
            >
              <span className="inline-block border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#3A3F44] pl-2.5 rtl:pl-0 rtl:pr-2.5">
                {t.hero.subtitle}
              </span>
            </div>

            {/* Supporting Paragraph */}
            <p
              id="hero-supporting-text"
              className="text-[#666666] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal"
            >
              {t.hero.description}
            </p>

            {/* CTA Buttons - Mobile-first stacked on small screens, row on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 mb-10 w-full sm:w-auto">
              <button
                type="button"
                id="hero-cta-request"
                onClick={() => scrollToSection("contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3A3F44] hover:bg-[#222222] text-white font-bold px-7 py-3.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <span>{t.hero.ctaRequest}</span>
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <button
                type="button"
                id="hero-cta-projects"
                onClick={() => scrollToSection("projects")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EEF0F2] text-[#3A3F44] font-bold px-6 py-3.5 rounded-lg border border-[#D9DDE1] shadow-xs transition-all duration-200 hover:border-[#8A8F94] text-base"
              >
                <span>{t.hero.ctaProjects}</span>
              </button>
            </div>

            {/* Trust Mini Grid */}
            <div
              id="hero-trust-grid"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#D9DDE1]"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#3A3F44] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-[#222222]">25+ Years</span>
                  <span className="text-xs text-[#666666]">{t.stats.yearsLabel}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-[#3A3F44] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-[#222222]">200+</span>
                  <span className="text-xs text-[#666666]">{t.stats.projectsLabel}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#3A3F44] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-[#222222]">Saudi Arabia</span>
                  <span className="text-xs text-[#666666]">{t.stats.locationLabel}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#3A3F44] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-[#222222]">100% Certified</span>
                  <span className="text-xs text-[#666666]">Professional</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white p-2 border border-[#D9DDE1] shadow-md">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-xl overflow-hidden bg-[#EEF0F2]">
                <img
                  src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80"
                  alt="Plumbing Solution commercial and residential building plumbing projects in Saudi Arabia"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80") {
                      target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/60 via-transparent to-transparent" />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-lg p-3.5 border border-[#D9DDE1] shadow-md flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8A8F94]">
                      {isRtl ? "المشاريع المنفذة" : "Completed Projects"}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#222222]">
                      {isRtl ? "مباني تجارية وسكنية ومجمعات" : "Commercial & Residential Towers"}
                    </span>
                  </div>
                  <div className="shrink-0 bg-[#EEF0F2] text-[#3A3F44] font-black text-sm px-2.5 py-1 rounded-md border border-[#D9DDE1]">
                    200+
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
