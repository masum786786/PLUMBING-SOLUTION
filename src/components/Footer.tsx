import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Phone, MapPin, Globe } from "lucide-react";

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { language, setLanguage, t } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      id="footer"
      className="bg-[#E5E7E9] text-[#333333] border-t border-[#CDD1D5] pt-14 pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 text-left rtl:text-right">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#3A3F44] text-white flex items-center justify-center font-bold text-sm">
                PS
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#222222]">
                PLUMBING SOLUTION
              </span>
            </div>
            <p className="text-[#555555] text-sm leading-relaxed mb-6 font-normal">
              {t.footer.aboutText}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#444444]">
              <MapPin className="w-4 h-4 text-[#3A3F44] shrink-0" />
              <span>{t.footer.locationText}</span>
            </div>
          </div>

          {/* Col 2: Company Links */}
          <div className="lg:col-span-2 text-left rtl:text-right">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#222222] mb-4">
              {t.footer.companyHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("about")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("projects")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("leadership")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.nav.experience}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("contact")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-[#555555] hover:text-[#222222] transition-colors font-medium flex items-center gap-1"
                >
                  <span>{t.nav.admin}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services List */}
          <div className="lg:col-span-3 text-left rtl:text-right">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#222222] mb-4">
              {t.footer.servicesHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.services.building.title}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.services.apartment.title}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.services.house.title}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.services.installation.title}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.services.maintenance.title}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("services")}
                  className="text-[#555555] hover:text-[#222222] transition-colors"
                >
                  {t.services.repair.title}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Leadership Contacts */}
          <div className="lg:col-span-3 text-left rtl:text-right">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#222222] mb-4">
              {t.footer.contactHeading}
            </h4>
            <div className="space-y-4 text-sm">
              <div className="bg-[#DBDFE2] p-3 rounded-lg border border-[#CDD1D5]">
                <span className="block text-xs font-bold text-[#222222]">
                  {t.footer.khalilLabel}
                </span>
                <a
                  href="tel:+966572547358"
                  className="inline-flex items-center gap-1.5 font-extrabold text-[#3A3F44] hover:text-[#222222] mt-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#3A3F44]" />
                  <span>+966 57 254 7358</span>
                </a>
              </div>

              <div className="bg-[#DBDFE2] p-3 rounded-lg border border-[#CDD1D5]">
                <span className="block text-xs font-bold text-[#222222]">
                  {t.footer.wasiLabel}
                </span>
                <a
                  href="tel:+966573157610"
                  className="inline-flex items-center gap-1.5 font-extrabold text-[#3A3F44] hover:text-[#222222] mt-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#3A3F44]" />
                  <span>+966 57 315 7610</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Language Selector & Copyright */}
        <div className="pt-8 border-t border-[#CDD1D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#444444]" />
            <span>Language:</span>
            <div className="inline-flex items-center gap-1 font-bold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`hover:text-[#222222] ${language === "en" ? "text-[#222222] underline" : ""}`}
              >
                English
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={`hover:text-[#222222] ${language === "ar" ? "text-[#222222] underline" : ""}`}
              >
                العربية
              </button>
            </div>
          </div>

          <p className="text-center sm:text-right font-normal">
            © 2026 Plumbing Solution. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
