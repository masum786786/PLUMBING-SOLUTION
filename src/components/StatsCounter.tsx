import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion, useInView } from "motion/react";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<CounterProps> = ({ end, suffix = "", duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutQuad
      const current = Math.round(start + (end - start) * (1 - (1 - progress) * (1 - progress)));
      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(end);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#222222] tracking-tight">
      {count}
      {suffix}
    </span>
  );
};

export const StatsCounter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="statistics-section" className="bg-[#EEF0F2] py-12 sm:py-16 border-b border-[#D9DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8A8F94] mb-2">
            {t.stats.title}
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#3A3F44]">
            {t.stats.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: 25+ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-5 sm:p-6 border border-[#D9DDE1] shadow-xs text-center flex flex-col items-center justify-center hover:border-[#8A8F94] transition-all"
          >
            <div className="mb-1">
              <AnimatedNumber end={25} suffix="+" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#3A3F44] mt-1">
              {t.stats.yearsLabel}
            </span>
            <span className="text-[11px] sm:text-xs text-[#8A8F94] mt-0.5">
              {t.about.h1}
            </span>
          </motion.div>

          {/* Card 2: 200+ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-5 sm:p-6 border border-[#D9DDE1] shadow-xs text-center flex flex-col items-center justify-center hover:border-[#8A8F94] transition-all"
          >
            <div className="mb-1">
              <AnimatedNumber end={200} suffix="+" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#3A3F44] mt-1">
              {t.stats.projectsLabel}
            </span>
            <span className="text-[11px] sm:text-xs text-[#8A8F94] mt-0.5">
              {t.about.h2}
            </span>
          </motion.div>

          {/* Card 3: Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-5 sm:p-6 border border-[#D9DDE1] shadow-xs text-center flex flex-col items-center justify-center hover:border-[#8A8F94] transition-all"
          >
            <div className="mb-1">
              <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#222222] tracking-tight">
                KSA
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#3A3F44] mt-1">
              {t.stats.locationValue}
            </span>
            <span className="text-[11px] sm:text-xs text-[#8A8F94] mt-0.5">
              {t.stats.locationLabel}
            </span>
          </motion.div>

          {/* Card 4: 15+ Senior Team Exp */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl p-5 sm:p-6 border border-[#D9DDE1] shadow-xs text-center flex flex-col items-center justify-center hover:border-[#8A8F94] transition-all"
          >
            <div className="mb-1">
              <AnimatedNumber end={15} suffix="+" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#3A3F44] mt-1">
              {t.stats.seniorLabel}
            </span>
            <span className="text-[11px] sm:text-xs text-[#8A8F94] mt-0.5">
              {t.leadership.wasi.role}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
