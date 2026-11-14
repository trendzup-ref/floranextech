import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ShoppingCart,
  Globe2,
  CheckCircle,
  Globe,
  Rocket,
  Brain,
  Users,
  BarChart3,
  Zap,
  Target,
  Palette,
  Award,
  Headphones,
} from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";

const marketplaces = [
  {
    name: "CopeCart",
    color: "#4d88ff", // Vibrant blue
    glow: "rgba(77, 136, 255, 0.25)",
    badge: "Official Vendor",
    link: "https://copecart.com",
    tagline: "High-conversion checkout & EU compliance",
  },
  {
    name: "Digistore24",
    color: "#28d17c", // Neon emerald green
    glow: "rgba(40, 209, 124, 0.25)",
    badge: "Verified Merchant",
    link: "https://digistore24.com",
    tagline: "Automated affiliate network & global sales",
  },
  {
    name: "ClickBank",
    color: "#ff7a29", // Vivid orange
    glow: "rgba(255, 122, 41, 0.25)",
    badge: "Top Seller",
    link: "https://clickbank.com",
    tagline: "Premier digital marketplace with worldwide scale",
  },
];

const trustPillars = [
  {
    title: "Results-Focused",
    desc: "Every project is built around measurable business outcomes and direct ROI.",
  },
  {
    title: "Innovation",
    desc: "We continuously adopt modern technologies, AI-powered solutions, and fast architectures.",
  },
  {
    title: "Transparency",
    desc: "Open communication, collaborative milestone reviews, and detailed reporting throughout every project.",
  },
  {
    title: "Long-Term Partnership",
    desc: "We grow alongside our clients through continuous technical support, iteration, and scaling strategies.",
  },
  {
    title: "Quality Assurance",
    desc: "Every solution undergoes rigorous testing, accessibility validation, and performance checks before launch.",
  },
];

const stats = [
  { value: 200, suffix: "+", label: "PROJECTS DELIVERED" },
  { value: 100, suffix: "+", label: "HAPPY CLIENTS" },
  { value: 15, suffix: "+", label: "INDUSTRIES SERVED" },
  { value: 98, suffix: "%", label: "CLIENT SATISFACTION" },
  { value: 5, suffix: "+", label: "YEARS OF EXPERIENCE" },
];

const whyChooseReasons = [
  {
    title: "AI-Powered Strategies",
    icon: Brain,
    desc: "We leverage advanced AI models to optimize campaigns and predict market trends in real-time.",
  },
  {
    title: "Dedicated Experts",
    icon: Users,
    desc: "Your brand gets a dedicated team of certified marketing specialists focused solely on your growth.",
  },
  {
    title: "Real-Time Reporting",
    icon: BarChart3,
    desc: "Transparent, live dashboards so you always know exactly how your campaigns are performing.",
  },
  {
    title: "Fast Execution",
    icon: Zap,
    desc: "Agile methodologies ensure rapid deployment of campaigns to capture market opportunities immediately.",
  },
  {
    title: "ROI-Focused Campaigns",
    icon: Target,
    desc: "Every strategy we deploy is engineered to maximize conversion efficiency and measurable returns.",
  },
  {
    title: "Creative Branding",
    icon: Palette,
    desc: "World-class visual storytelling that elevates your brand identity and captivates your audience.",
  },
  {
    title: "Certified Professionals",
    icon: Award,
    desc: "Our team holds premier industry certifications across Google, Meta, AWS, and enterprise tech stacks.",
  },
  {
    title: "24×7 Support",
    icon: Headphones,
    desc: "Round-the-clock monitoring and dedicated technical assistance to ensure continuous operational uptime.",
  },
];

export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary text-white select-none">
      {/* Background Grid Pattern (10 cols on mobile, 20 cols on desktop) */}
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
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-secondary/5 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20 space-y-18">

        {/* Hero Header */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-4">

          <h1 className="text-white text-5xl sm:text-5xl lg:text-6xl font-semibold font-display leading-[0.88] tracking-[0.020em] uppercase">
            Architecting the future of digital scale
          </h1>

          <p className="font-body text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed mt-1">
            Floranextech operates at the intersection of computational engineering, high-performance marketing, and standalone proprietary digital products.
          </p>
        </div>

        {/* ==================== VISION, MISSION & IMPACT STATS SECTION ==================== */}
        <section className="relative w-full space-y-6">
          {/* Top Row: Dual Cards (Our Vision & Our Mission) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1: Our Vision */}
            <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 hover:border-secondary/60 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_35px_rgba(61,242,224,0.18)]">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(61,242,224,0.2)]">
                  <Globe className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                  Our Vision
                </h3>
                <p className="font-body text-gray-300 text-sm sm:text-base leading-relaxed">
                  To become a globally trusted digital partner recognized for innovation, transparency, and measurable business growth.
                </p>
              </div>
            </div>

            {/* Card 2: Our Mission */}
            <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 hover:border-secondary/60 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_35px_rgba(61,242,224,0.18)]">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(61,242,224,0.2)]">
                  <Rocket className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                  Our Mission
                </h3>
                <p className="font-body text-gray-300 text-sm sm:text-base leading-relaxed">
                  To empower businesses through technology, creativity, and strategic digital solutions that create long-term value.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Row: 5 Impact Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 hover:border-secondary/50 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(61,242,224,0.15)]"
              >
                <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white group-hover:text-secondary transition-colors duration-200">
                  <NumberTicker value={stat.value} />
                  <span>{stat.suffix}</span>
                </div>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 mt-2 font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== GLOBAL DIGITAL PRODUCTS MARKETPLACE SECTION ==================== */}
        <section className="relative w-full rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-18 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left Column: Text & Editorial Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Headline */}
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[0.92]">
                Verified on Trusted <br />
                <span className="text-secondary">Marketplaces</span>
              </h2>

              {/* Paragraphs matching the reference format */}
              <div className="space-y-4 font-body text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                <p>
                  Alongside our client services, Floranextech creates premium digital products designed for entrepreneurs, marketers, agencies, and business professionals worldwide.
                </p>
                <p className="text-gray-400">
                  Our products and premium digital publications are officially verified, distributed, and processed through the world's most trusted software marketplaces and merchant platforms.
                </p>
              </div>
            </div>

            {/* Right Column: Marketplace Channels Cards (CopeCart, Digistore24, ClickBank) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {marketplaces.map((market) => (
                <a
                  key={market.name}
                  href={market.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl md:rounded-3xl bg-black/40 border border-white/10 hover:border-white/30 p-6 sm:p-7 flex items-center justify-between transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    boxShadow: `0 0 0 0 ${market.glow}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = market.color;
                    e.currentTarget.style.boxShadow = `0 0 25px ${market.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex flex-col">
                    <span
                      className="font-display text-2xl sm:text-3xl font-bold tracking-wide transition-colors duration-200"
                      style={{ color: market.color }}
                    >
                      {market.name}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 group-hover:scale-105 transition-all duration-200 shrink-0 ml-4">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>

      </div>

      {/* ==================== WHY BUSINESSES TRUST SECTION ==================== */}
      <section className="relative w-full space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-semibold font-display leading-[0.9] tracking-[0.020em] uppercase">
            Why Businesses Trust Floranextech
          </h2>
          <p className="font-body text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
            Our core principles ensure reliable delivery, technical excellence, and sustainable digital momentum.
          </p>
        </div>

        {/* Cards Grid: 3 on top row, 2 centered or on bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 hover:border-secondary/60 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]"
            >
              <div className="space-y-4">
                {/* Purple-cyan circular checkmark badge (matching screenshot) */}
                <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300 shadow-[0_0_12px_rgba(61,242,224,0.15)]">
                  <CheckCircle className="w-5 h-5 stroke-[2.2]" />
                </div>

                <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                  {pillar.title}
                </h3>

                <p className="font-body text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== WHY CHOOSE FLORANEXTECH SECTION (PLACED AT END) ==================== */}
      <section className="relative z-10 w-full max-w-[1500px] mx-auto mt-20 px-4 sm:px-6 lg:px-12 pb-20 lg:pb-28 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-semibold font-display leading-[0.9] tracking-[0.020em] uppercase">
            Why Choose Floranextech
          </h2>
          <p className="font-body text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            We don't just run ads; we engineer scalable growth engines. Here's why leading brands trust us with their digital presence.
          </p>
        </div>

        {/* 8-Card Grid (4 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseReasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white/10 hover:border-secondary/60 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]"
              >
                <div className="space-y-4">
                  {/* Glowing Indigo/Cyan Icon Container */}
                  <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300 shadow-[0_0_12px_rgba(61,242,224,0.15)]">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="font-body text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
