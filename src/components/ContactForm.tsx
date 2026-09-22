import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Send, CheckCircle2, AlertCircle, Phone, User, MapPin, FileText, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface FormValues {
  fullName: string;
  address: string;
  mobile: string;
  workDetails: string;
}

interface FormErrors {
  fullName?: string;
  address?: string;
  mobile?: string;
  workDetails?: string;
  server?: string;
}

export const ContactForm: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const [values, setValues] = useState<FormValues>({
    fullName: "",
    address: "",
    mobile: "",
    workDetails: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = t.form.errors.nameRequired;
    }

    if (!values.address.trim()) {
      newErrors.address = t.form.errors.addressRequired;
    }

    // Phone validation: allow +966, 05, etc.
    const cleanMobile = values.mobile.replace(/[\s-]/g, "");
    if (!cleanMobile) {
      newErrors.mobile = t.form.errors.mobileRequired;
    } else if (!/^(\+?966|0)?5[0-9]{8}$/.test(cleanMobile) && cleanMobile.length < 9) {
      newErrors.mobile = t.form.errors.mobileInvalid;
    }

    if (!values.workDetails.trim()) {
      newErrors.workDetails = t.form.errors.detailsRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.fullName.trim(),
          address: values.address.trim(),
          mobile: values.mobile.trim(),
          work_details: values.workDetails.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.form.errors.serverError);
      }

      setIsSuccess(true);
      setValues({
        fullName: "",
        address: "",
        mobile: "",
        workDetails: "",
      });
    } catch (err: any) {
      setErrors({ server: err.message || t.form.errors.serverError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#F5F6F7] py-14 sm:py-20 lg:py-24 border-b border-[#D9DDE1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-[#D9DDE1] rounded-full px-3.5 py-1 mb-3 shadow-xs">
            <Send className="w-3.5 h-3.5 text-[#3A3F44]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#3A3F44]">
              {t.form.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-4">
            {t.form.title}
          </h2>
          <p className="text-[#666666] text-sm sm:text-base leading-relaxed">
            {t.form.subtitle}
          </p>
        </div>

        {/* Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[#D9DDE1] shadow-sm p-6 sm:p-10 text-left rtl:text-right"
        >
          {isSuccess ? (
            <div
              id="submission-success-banner"
              className="py-10 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#222222] mb-2">
                {t.form.successTitle}
              </h3>
              <p className="text-[#666666] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed font-normal">
                {t.form.successMessage}
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="bg-[#3A3F44] hover:bg-[#222222] text-white font-bold text-sm px-6 py-3 rounded-lg shadow-xs transition-colors"
              >
                {t.form.submitAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {errors.server && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{errors.server}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-xs sm:text-sm font-bold text-[#222222] mb-1.5"
                  >
                    {t.form.fullName} <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="full_name"
                      name="fullName"
                      value={values.fullName}
                      onChange={(e) => setValues({ ...values, fullName: e.target.value })}
                      placeholder={t.form.fullNamePlaceholder}
                      className={`w-full bg-white border ${
                        errors.fullName ? "border-red-500" : "border-[#D9DDE1]"
                      } focus:border-[#3A3F44] focus:ring-1 focus:ring-[#3A3F44] rounded-lg px-3.5 py-3 text-sm text-[#222222] placeholder-[#8A8F94] outline-none transition-colors`}
                    />
                    <User className="w-4 h-4 text-[#8A8F94] absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 pointer-events-none" />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.fullName}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-xs sm:text-sm font-bold text-[#222222] mb-1.5"
                  >
                    {t.form.mobile} <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={values.mobile}
                      onChange={(e) => setValues({ ...values, mobile: e.target.value })}
                      placeholder={t.form.mobilePlaceholder}
                      className={`w-full bg-white border ${
                        errors.mobile ? "border-red-500" : "border-[#D9DDE1]"
                      } focus:border-[#3A3F44] focus:ring-1 focus:ring-[#3A3F44] rounded-lg px-3.5 py-3 text-sm text-[#222222] placeholder-[#8A8F94] outline-none transition-colors`}
                    />
                    <Phone className="w-4 h-4 text-[#8A8F94] absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 pointer-events-none" />
                  </div>
                  {errors.mobile ? (
                    <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.mobile}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-[#8A8F94]">{t.form.mobileHelper}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs sm:text-sm font-bold text-[#222222] mb-1.5"
                >
                  {t.form.address} <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={values.address}
                    onChange={(e) => setValues({ ...values, address: e.target.value })}
                    placeholder={t.form.addressPlaceholder}
                    className={`w-full bg-white border ${
                      errors.address ? "border-red-500" : "border-[#D9DDE1]"
                    } focus:border-[#3A3F44] focus:ring-1 focus:ring-[#3A3F44] rounded-lg px-3.5 py-3 text-sm text-[#222222] placeholder-[#8A8F94] outline-none transition-colors`}
                  />
                  <MapPin className="w-4 h-4 text-[#8A8F94] absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 pointer-events-none" />
                </div>
                {errors.address && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.address}</p>
                )}
              </div>

              {/* Work / Project Details */}
              <div>
                <label
                  htmlFor="work_details"
                  className="block text-xs sm:text-sm font-bold text-[#222222] mb-1.5"
                >
                  {t.form.workDetails} <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="work_details"
                    name="workDetails"
                    rows={4}
                    value={values.workDetails}
                    onChange={(e) => setValues({ ...values, workDetails: e.target.value })}
                    placeholder={t.form.workDetailsPlaceholder}
                    className={`w-full bg-white border ${
                      errors.workDetails ? "border-red-500" : "border-[#D9DDE1]"
                    } focus:border-[#3A3F44] focus:ring-1 focus:ring-[#3A3F44] rounded-lg p-3.5 text-sm text-[#222222] placeholder-[#8A8F94] outline-none transition-colors resize-y`}
                  />
                  <FileText className="w-4 h-4 text-[#8A8F94] absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 pointer-events-none" />
                </div>
                {errors.workDetails && (
                  <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.workDetails}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-request-button"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3A3F44] hover:bg-[#222222] disabled:bg-[#8A8F94] text-white font-bold text-base px-8 py-3.5 rounded-lg shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t.form.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.form.submitButton}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
