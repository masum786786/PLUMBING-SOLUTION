import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { WHY_CHOOSE_DATA } from "../data/content";
import {
  Award,
  CheckCircle2,
  Users,
  MapPin,
  ShieldCheck,
  Clock,
  Building2,
  HeartHandshake,
  HelpCircle,
} from "lucide-react";
import { motion } from "motion/react";

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (name: string) => {
    switch (name) {
      case "Award":
        return <Award className="w-6 h-6 text-[#3A3F44]" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-6 h-6 text-[#3A3F44]" />;
      case "Users":
        return <Users className="w-6 h-6 text-[#3A3F44]" />;
      case "MapPin":
        return <MapPin className="w-6 h-6 text-[#3A3F44]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-[#3A3F44]" />;
      case "Clock":
        return <Clock className="w-6 h-6 text-[#3A3F44]" />;
      case "Building2":
        return <Building2 className="w-6 h-6 text-[#3A3F44]" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-6 h-6 text-[#3A3F44]" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-[#3A3F44]" />;
    }
  };

  const getTitle = (id: string) => {
    switch (id) {
      case "why-1":
        return t.why.w1.title;
      case "why-2":
        return t.why.w2.title;
      case "why-3":
        return t.why.w3.title;
      case "why-4":
        return t.why.w4.title;
      case "why-5":
        return t.why.w5.title;
      case "why-6":
        return t.why.w6.title;
      case "why-7":
        return t.why.w7.title;
      case "why-8":
        return t.why.w8.title;
      default:
        return "";
    }
  };

  const getDesc = (id: string) => {
    switch (id) {
      case "why-1":
        return t.why.w1.desc;
      case "why-2":
        return t.why.w2.desc;
      case "why-3":
        return t.why.w3.desc;
      case "why-4":
        return t.why.w4.desc;
      case "why-5":
        return t.why.w5.desc;
      case "why-6":
        return t.why.w6.desc;
      case "why-7":
        return t.why.w7.desc;
      case "why-8":
        return t.why.w8.desc;
      default:
        return "";
    }
  };

  return (
    <section id="why-us" className="bg-[#F5F6F7] py-14 sm:py-20 lg:py-24 border-b border-[#D9DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-[#D9DDE1] rounded-full px-3.5 py-1 mb-3 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#3A3F44]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
              {t.why.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.why.title}
          </h2>
          <p className="text-[#666666] text-sm sm:text-base leading-relaxed">
            {t.why.subtitle}
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {WHY_CHOOSE_DATA.map((item, index) => {
            const title = getTitle(item.id);
            const desc = getDesc(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group bg-white rounded-xl p-5 sm:p-6 border border-[#D9DDE1] hover:border-[#8A8F94] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left rtl:text-right flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#EEF0F2] group-hover:bg-[#3A3F44] flex items-center justify-center mb-4 transition-colors duration-300">
                    <span className="group-hover:text-white transition-colors duration-300">
                      {getIcon(item.iconName)}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#222222] mb-2 group-hover:text-[#3A3F44] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
