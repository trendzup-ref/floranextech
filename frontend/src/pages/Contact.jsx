import { useState } from "react";
import { Mail, Phone, MapPin, Send, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { sendContactEnquiry } from "@/api/messageApi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      return setError("Please fill in all required fields.");
    }

    try {
      setLoading(true);
      const res = await sendContactEnquiry(formData);

      if (res?.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError(res?.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while sending your message. Please try again.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary text-white select-none">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.16] [background-size:calc(100%/10)_calc(100vw/10)] md:[background-size:calc(100%/20)_calc(100vw/20)]"
          style={{
            backgroundImage: `
              linear-gradient(to right, gray 1px, transparent 1px),
              linear-gradient(to bottom, gray 1px, transparent 1px)
            `,
            backgroundPosition: "top left",
          }}
        />
      </div>

      <section className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20 flex flex-col items-center">
        {/* Page Header */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center gap-4 mb-10">
          <h1 className="text-white text-4xl sm:text-6xl lg:text-6xl font-semibold font-display leading-[0.88] tracking-[0.020em] uppercase">
            Let's build something exceptional
          </h1>

          <p className="font-body text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed mt-1">
            Have a project in mind, an inquiry about our services, or want to discuss a partnership? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Two-Column Grid: Form on Left, Contact Information on Right */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Contact Form */}
          <div className="lg:col-span-7 rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 hover:border-secondary/40 p-7 sm:p-10 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h2 className="font-display text-2xl sm:text-3xl tracking-wide text-white uppercase mb-2">
              Send us a Message
            </h2>
            <p className="font-body text-xs sm:text-sm text-gray-400 mb-8">
              Fill out the form below and we'll connect with you shortly.
            </p>

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center gap-3 bg-secondary/5 border border-secondary/30 rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 h-12 text-secondary animate-bounce" />
                <h3 className="font-display text-2xl text-white uppercase tracking-wide">
                  Message Received!
                </h3>
                <p className="font-body text-sm text-gray-300 max-w-md">
                  Thank you for reaching out. A Floranextech strategist will review your requirements and respond promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold"
                    >
                      Your Name <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      disabled={loading}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none transition-all duration-200 disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold"
                    >
                      Email Address <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={loading}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none transition-all duration-200 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold"
                  >
                    Subject <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    disabled={loading}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Website Redesign / Performance Marketing"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none transition-all duration-200 disabled:opacity-60"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold"
                  >
                    Message <span className="text-secondary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    disabled={loading}
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your brand, timeline, and goals..."
                    className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none resize-none transition-all duration-200 disabled:opacity-60"
                  />
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-body flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto font-body font-bold text-sm rounded-md uppercase bg-secondary px-9 py-4 hover:scale-[1.02] hover:bg-white transition-all duration-300 ease-out cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="inline-flex items-center gap-2 font-bold text-primary">
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                          Sending Enquiry...
                        </>
                      ) : (
                        <>
                          Send Inquiry <Send className="w-4 h-4 text-primary" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: Contact Information (Same as Footer) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 p-7 sm:p-9 space-y-7 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl tracking-wide text-white uppercase mb-2">
                  Direct Channels
                </h2>
                <p className="font-body text-xs sm:text-sm text-gray-400">
                  Connect with our team directly via phone, email, or visit our headquarters.
                </p>
              </div>

              <div className="space-y-6">
                {/* Headquarters */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-[0_0_15px_rgba(61,242,224,0.15)] group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                    <MapPin className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white text-xs uppercase tracking-wider mb-1 font-body">
                      Headquarters
                    </span>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      43 NEAR MOTHER SCHOOL, ADHCHINI, MMTC/STC Colony, SOUTH DELHI, DELHI, 110017.
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-[0_0_15px_rgba(61,242,224,0.15)] group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                    <Phone className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white text-xs uppercase tracking-wider mb-1 font-body">
                      Phone Number
                    </span>
                    <a
                      href="tel:+919971123820"
                      className="text-gray-300 hover:text-secondary text-sm font-medium transition-colors"
                    >
                      +91 9971123820
                    </a>
                    <span className="block text-[11px] text-gray-500 font-mono mt-0.5">
                      Mon – Sat: 9:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-[0_0_15px_rgba(61,242,224,0.15)] group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white text-xs uppercase tracking-wider mb-1 font-body">
                      Email Inquiries
                    </span>
                    <a
                      href="mailto:info@floranextech.com"
                      className="block text-gray-300 hover:text-secondary text-sm font-medium transition-colors"
                    >
                      info@floranextech.com
                    </a>
                    <a
                      href="mailto:floranextech@gmail.com"
                      className="block text-gray-300 hover:text-secondary text-sm font-medium transition-colors mt-0.5"
                    >
                      floranextech@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
