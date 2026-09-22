import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { PROJECTS_DATA } from "../data/content";
import { MapPin, Layers, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t.projects.allCategories },
    { id: "buildings", label: t.projects.categories.buildings },
    { id: "apartments", label: t.projects.categories.apartments },
    { id: "houses", label: t.projects.categories.houses },
    { id: "plumbing", label: t.projects.categories.plumbing },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeCategory);

  const getProjectTitle = (id: string) => {
    switch (id) {
      case "proj-1":
        return t.projects.p1.title;
      case "proj-2":
        return t.projects.p2.title;
      case "proj-3":
        return t.projects.p3.title;
      case "proj-4":
        return t.projects.p4.title;
      case "proj-5":
        return t.projects.p5.title;
      case "proj-6":
        return t.projects.p6.title;
      default:
        return "";
    }
  };

  const getProjectDesc = (id: string) => {
    switch (id) {
      case "proj-1":
        return t.projects.p1.desc;
      case "proj-2":
        return t.projects.p2.desc;
      case "proj-3":
        return t.projects.p3.desc;
      case "proj-4":
        return t.projects.p4.desc;
      case "proj-5":
        return t.projects.p5.desc;
      case "proj-6":
        return t.projects.p6.desc;
      default:
        return "";
    }
  };

  const getProjectLocation = (id: string) => {
    switch (id) {
      case "proj-1":
        return t.projects.locations.riyadh;
      case "proj-2":
        return t.projects.locations.jeddah;
      case "proj-3":
        return t.projects.locations.dammam;
      case "proj-4":
        return t.projects.locations.khobar;
      case "proj-5":
        return t.projects.locations.makkah;
      case "proj-6":
        return t.projects.locations.medina;
      default:
        return t.common.saudiArabia;
    }
  };

  const getProjectStats = (id: string) => {
    switch (id) {
      case "proj-1":
        return t.projects.p1.stats;
      case "proj-2":
        return t.projects.p2.stats;
      case "proj-3":
        return t.projects.p3.stats;
      case "proj-4":
        return t.projects.p4.stats;
      case "proj-5":
        return t.projects.p5.stats;
      case "proj-6":
        return t.projects.p6.stats;
      default:
        return "";
    }
  };

  return (
    <section id="projects" className="bg-white py-14 sm:py-20 lg:py-24 border-b border-[#D9DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F5F6F7] border border-[#D9DDE1] rounded-full px-3.5 py-1 mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#3A3F44]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
              {t.projects.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.projects.title}
          </h2>
          <p className="text-[#666666] text-sm sm:text-base leading-relaxed">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              id={`project-filter-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-[#3A3F44] text-white shadow-xs"
                  : "bg-[#F5F6F7] hover:bg-[#EEF0F2] text-[#666666] hover:text-[#222222] border border-[#D9DDE1]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const title = getProjectTitle(project.id);
              const desc = getProjectDesc(project.id);
              const location = getProjectLocation(project.id);
              const stats = getProjectStats(project.id);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-2xl border border-[#D9DDE1] hover:border-[#8A8F94] shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden text-left rtl:text-right"
                >
                  {/* Project Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF0F2]">
                    <img
                      src={project.image}
                      alt={title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80") {
                          target.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/50 via-transparent to-transparent" />

                    {/* Stats pill on top */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-[#3A3F44] border border-[#D9DDE1] shadow-xs flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#3A3F44]" />
                      <span>{stats}</span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-white/90 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#222222] group-hover:text-[#3A3F44] transition-colors mb-2">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#666666] leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EEF0F2] flex items-center justify-between text-xs font-bold text-[#8A8F94]">
                      <span>{t.common.saudiArabia}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t.rating.points[1]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
