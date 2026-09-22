import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { SERVICES_DATA } from "../data/content";
import { ArrowRight, ArrowLeft, Wrench } from "lucide-react";
import { motion } from "motion/react";

export const ServicesSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const scrollToContactWithService = (serviceTitle: string) => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const detailsField = document.getElementById("work_details") as HTMLTextAreaElement | null;
      if (detailsField && !detailsField.value) {
        detailsField.value = `${isRtl ? "طلب بخصوص خدمة: " : "Inquiry regarding: "} ${serviceTitle} - `;
        detailsField.focus();
      }
    }
  };

  const getServiceTitle = (id: string) => {
    switch (id) {
      case "building-plumbing":
        return t.services.building.title;
      case "apartment-plumbing":
        return t.services.apartment.title;
      case "house-plumbing":
        return t.services.house.title;
      case "plumbing-installation":
        return t.services.installation.title;
      case "plumbing-maintenance":
        return t.services.maintenance.title;
      case "plumbing-repair":
        return t.services.repair.title;
      default:
        return "";
    }
  };

  const getServiceDesc = (id: string) => {
    switch (id) {
      case "building-plumbing":
        return t.services.building.desc;
      case "apartment-plumbing":
        return t.services.apartment.desc;
      case "house-plumbing":
        return t.services.house.desc;
      case "plumbing-installation":
        return t.services.installation.desc;
      case "plumbing-maintenance":
        return t.services.maintenance.desc;
      case "plumbing-repair":
        return t.services.repair.desc;
      default:
        return "";
    }
  };

  return (
    <section id="services" className="bg-[#F5F6F7] py-14 sm:py-20 lg:py-24 border-b border-[#D9DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-[#D9DDE1] rounded-full px-3.5 py-1 mb-3 shadow-xs">
            <Wrench className="w-3.5 h-3.5 text-[#3A3F44]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
              {t.services.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.services.title}
          </h2>
          <p className="text-[#666666] text-sm sm:text-base leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Card Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service, index) => {
            const title = getServiceTitle(service.id);
            const desc = getServiceDesc(service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-white rounded-2xl border border-[#D9DDE1] hover:border-[#8A8F94] shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden text-left rtl:text-right"
              >
                {/* Large Image with subtle zoom on hover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF0F2]">
                  <img
                    src={service.image}
                    alt={title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80") {
                        target.src = "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/30 via-transparent to-transparent" />

                  {/* Badge */}
                  <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/95 backdrop-blur-sm text-[#3A3F44] text-xs font-bold px-2.5 py-1 rounded-md border border-[#D9DDE1] shadow-xs">
                    KSA Certified
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#222222] group-hover:text-[#3A3F44] transition-colors mb-2.5">
                      {title}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed mb-6 font-normal">
                      {desc}
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    type="button"
                    onClick={() => scrollToContactWithService(title)}
                    className="w-full inline-flex items-center justify-between bg-[#F5F6F7] group-hover:bg-[#3A3F44] text-[#3A3F44] group-hover:text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg border border-[#D9DDE1] group-hover:border-[#3A3F44] transition-all duration-200"
                  >
                    <span>{t.services.actionButton}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
