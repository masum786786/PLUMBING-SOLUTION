import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const RatingSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="rating" className="bg-[#EEF0F2] py-14 sm:py-20 border-b border-[#D9DDE1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 sm:p-10 border border-[#D9DDE1] shadow-sm text-center"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#F5F6F7] border border-[#D9DDE1] rounded-full px-3.5 py-1 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3A3F44]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
              {t.rating.eyebrow}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.rating.title}
          </h2>

          {/* Stars and Score */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="flex items-center gap-1.5 mb-3 text-[#B8860B]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-7 h-7 fill-[#B8860B] stroke-[#B8860B]"
                />
              ))}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-[#222222] tracking-tight">
                5.0
              </span>
              <span className="text-lg font-bold text-[#8A8F94]">/ 5.0</span>
            </div>

            <p className="text-sm sm:text-base font-extrabold text-[#3A3F44] mt-2">
              {t.rating.subtitle}
            </p>
          </div>

          <p className="text-[#666666] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            {t.rating.description}
          </p>

          {/* Trust Check Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-[#D9DDE1]">
            {t.rating.points.map((point, i) => (
              <div
                key={i}
                className="flex items-center justify-center sm:justify-start gap-2 bg-[#F5F6F7] px-3.5 py-2.5 rounded-lg border border-[#D9DDE1] text-xs font-semibold text-[#3A3F44]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#3A3F44] shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
