import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { LEADERSHIP_DATA } from "../data/content";
import {
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  Award,
} from "lucide-react";
import { motion } from "motion/react";

export const LeadershipSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  return (
    <section
      id="leadership"
      className="bg-white py-14 sm:py-20 lg:py-24 border-b border-[#D9DDE1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F5F6F7] border border-[#D9DDE1] rounded-full px-3.5 py-1 mb-3">
            <Award className="w-3.5 h-3.5 text-[#3A3F44]" />

            <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
              {t.leadership.eyebrow}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.leadership.title}
          </h2>

          <p className="text-[#666666] text-sm sm:text-base leading-relaxed">
            {t.leadership.subtitle}
          </p>
        </div>

        {/* 2 Leadership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {LEADERSHIP_DATA.map((leader, index) => {
            const role =
              index === 0
                ? t.leadership.khalil.role
                : t.leadership.wasi.role;

            const exp =
              index === 0
                ? t.leadership.khalil.exp
                : t.leadership.wasi.exp;

            const cleanPhone = leader.phone.replace(/[^0-9]/g, "");

            // Local images from public folder
            const leaderImage =
              index === 0 ? "/khalil.jpg" : "/wasi.jpeg";

            return (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9DDE1] hover:border-[#8A8F94] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left rtl:sm:text-right"
              >
                {/* Circular Profile Image */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#D9DDE1] shadow-sm bg-[#EEF0F2]">
                    <img
                      src={leaderImage}
                      alt={leader.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 bg-[#3A3F44] text-white p-1.5 rounded-full shadow-xs">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#222222] mb-1">
                      {leader.name}
                    </h3>

                    <p className="text-sm font-bold text-[#3A3F44] mb-3">
                      {role}
                    </p>

                    <div className="flex flex-col gap-1.5 text-xs text-[#666666] mb-5">
                      {/* Experience */}
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Award className="w-4 h-4 text-[#8A8F94] shrink-0" />

                        <span className="font-semibold text-[#3A3F44]">
                          {exp}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <MapPin className="w-4 h-4 text-[#8A8F94] shrink-0" />

                        <span>{t.common.saudiArabia}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Call & WhatsApp */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#EEF0F2] w-full">
                    {/* Call */}
                    <a
                      href={`tel:${leader.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#F5F6F7] hover:bg-[#EEF0F2] text-[#222222] text-xs font-bold py-2.5 px-3 rounded-lg border border-[#D9DDE1] transition-colors"
                      title={t.leadership.callDirect}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#3A3F44]" />

                      <span className="truncate">
                        {leader.phone}
                      </span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        isRtl
                          ? "السلام عليكم، أرغب في الاستفسار عن خدمات شركة حلول السباكة."
                          : "Hello, I would like to inquire about Plumbing Solution services."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-[#3A3F44] hover:bg-[#222222] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-xs transition-colors"
                      title={t.leadership.whatsappDirect}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />

                      <span>{t.common.whatsapp}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};