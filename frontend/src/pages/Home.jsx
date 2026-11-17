import { motion } from "motion/react";
import { ArrowUpRight, TrendingUp, Sparkles, Globe, Code2, Layers, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import ProcessSection from "@/components/ProcessSection";
import heroMeetingImg from "@/assets/Floranextech_hero_image.webp";


export default function Home() {
  return (
    <div className="relative overflow-hidden bg-primary text-white select-none">
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Subtle Grid pattern*/}
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

      {/* Main Hero Container */}
      <section className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-8 lg:py-12">

        {/* -------------------- ROW 1: "WE DRIVE" + RIGHT SHOWCASE CARD -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch mb-4 lg:mb-6">

          {/* Big Typography: WE DRIVE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 flex items-center"
          >
            <h1 className="font-display font-bold text-[22vw] sm:text-[17vw] lg:text-[21vw]  leading-[0.82] tracking-[0.001em] text-white uppercase select-none drop-shadow-sm whitespace-nowrap">
              WE DRIVE
            </h1>
          </motion.div>

          {/* Top-Right Neon Green/Cyan Showcase Card (Matching reference green UI card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-4 relative rounded-2xl md:rounded-3xl bg-secondary p-4 sm:p-5 overflow-hidden flex flex-col justify-between group h-auto min-h-[200px] sm:h-[240px] lg:h-[220px] xl:h-[230px] 2xl:h-[250px]"
          >
            {/* Top Bar inside card */}
            <div className="flex items-center justify-between text-primary mb-2">
              <span className="font-display tracking-wider text-base sm:text-lg uppercase font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" /> Scale Engine
              </span>
              <span className="bg-primary text-secondary text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
              </span>
            </div>

            {/* Simulated Dual Mobile / Case Study Preview Screens */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-1">
              {/* Screen 1 */}
              <div className="bg-[#020202] rounded-xl p-2 sm:p-2.5 border border-primary/20 shadow-lg transform -rotate-1 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-gray-400 mb-1 font-mono">
                  <span>D2C BRAND</span>
                  <span className="text-secondary font-bold">+284%</span>
                </div>
                <div className="w-full h-12 sm:h-14 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex flex-col justify-center items-center text-center p-1 sm:p-1.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-0.5">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-white leading-tight">Paid Media</span>
                </div>
                <div className="mt-1 sm:mt-1.5 space-y-1">
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-secondary rounded-full" />
                  </div>
                </div>
              </div>

              {/* Screen 2 */}
              <div className="bg-[#020202] rounded-xl p-2 sm:p-2.5 border border-primary/20 shadow-lg transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-gray-400 mb-1 font-mono">
                  <span>OMNICHANNEL</span>
                  <span className="text-secondary font-bold">5.8x</span>
                </div>
                <div className="w-full h-12 sm:h-14 rounded-lg bg-neutral-900 border border-white/10 p-1.5 flex flex-col justify-between">
                  <span className="text-[8px] sm:text-[9px] text-gray-400 font-mono">RETENTION</span>
                  <div className="font-display text-secondary text-lg sm:text-xl leading-none">
                    92.4<span className="text-[9px] sm:text-[10px] font-body">%</span>
                  </div>
                  <span className="text-[7px] text-gray-500 uppercase tracking-wider">Top 1%</span>
                </div>
                <div className="mt-1 sm:mt-1.5 space-y-1">
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full w-11/12 bg-secondary rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Summary */}
            <div className="mt-2 pt-2 border-t border-primary/15 flex items-center justify-between text-primary font-body text-xs font-semibold">
              <span className="text-[11px] sm:text-xs">Hyper-growth architecture</span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[10px] sm:text-[11px]">
                Explore Work <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </div>

        {/* -------------------- ROW 2: LEFT IMAGE/VIDEO CARD + "GROWTH" -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">

          {/* Bottom-Left Visual Showcase Card (Matching reference photograph container) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5 relative rounded-2xl md:rounded-3xl overflow-hidden border border-secondary/25 group shadow-[0_0_35px_rgba(0,0,0,0.8)] h-[200px] sm:h-[240px] lg:h-[220px] xl:h-[230px] 2xl:h-[250px] order-2 lg:order-1"
          >
            {/* High-Impact Visual Background: Digital Agency Strategy Meeting / Brand Growth */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url(${heroMeetingImg})`,
              }}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-secondary/15 mix-blend-color" />

            {/* Content overlay inside photo */}
            <div className="relative z-10 h-full p-4 sm:p-6 flex flex-col justify-between">
              <div className="inline-flex items-center gap-2 self-start px-2.5 py-0.5 rounded-full bg-primary/70 backdrop-blur-md border border-secondary/30 text-[10px] text-secondary font-mono">
              </div>

              <div>
                <p className="font-display text-xl sm:text-2xl lg:text-3xl tracking-wide text-white mb-1">
                  DATA-DRIVEN STORYTELLING
                </p>
                <p className="font-body text-xs sm:text-sm text-gray-300 max-w-sm line-clamp-2">
                  We blend high-conversion performance marketing with cutting-edge digital experiences.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Big Typography: GROWTH */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex items-center justify-start lg:justify-end order-1 lg:order-2"
          >
            <h1 className="font-display font-bold text-[22vw] sm:text-[19vw] lg:text-[21vw] leading-[0.8] tracking-[0.004em] text-white uppercase select-none drop-shadow-sm whitespace-nowrap">
              GROWTH
            </h1>
          </motion.div>
        </div>

        {/* -------------------- CTA & VALUE PROPOSITION BAR -------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 sm:mt-10 lg:mt-15 pt-6 sm:pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="max-w-xl">
            <p className="font-display text-2xl sm:text-3xl text-white uppercase">
              ACCELERATING BRANDS THROUGH INTELLIGENT MARKETING
            </p>
            <p className="font-body text-xs sm:text-sm text-gray-400  leading-relaxed">
              We combine premium visual storytelling with data-driven performance marketing to turn visitors into loyal customers and scale your revenue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            <Link to="/contact" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto font-body font-bold text-xs sm:text-sm  uppercase  rounded-full text-primary bg-secondary  px-7 py-3.5 hover:bg-white transition-all duration-300 ease-out"
              >
                Start Your Project
              </button>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary border border-white/20 hover:border-secondary text-xs sm:text-sm font-body font-medium text-gray-300 hover:text-secondary transition-all"
            >
              Our Solutions <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* section 2 */}
      <div className=" mt-4 w-screen h-screen bg-secondary flex items-center justify-center  overflow-hidden relative z-2">
        <div className="w-3/4 px-8 py-24 flex flex-col gap-8 items-center justify-between">
          <h1 className="text-black text-6xl lg:text-[22vh] text-center font-semibold font-display leading-[0.86] tracking-[-0.01em] select-none">
            We are a next gen<br></br> AI-powered digital agency
          </h1>
          <div className="w-full md:w-2/4">
            <p className="text-primary text-sm md:text-md text-center">
              Floranextech helps startups, enterprises, and eCommerce brands scale through performance marketing, SEO, web development, and AI-driven growth strategies.
            </p>
          </div>
          <div>
            <Link to="/services">
              <button className="bg-primary font-bold font-body text-secondary rounded-full px-4 py-3 hover:bg-white hover:text-primary transition-all duration-300 ease-out cursor-pointer ">
                Explore Services
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* section 3 */}
      <section className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-20 flex flex-col items-center">
        {/* Section Heading */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold font-display leading-[0.88]  uppercase">
            Scale faster with our Digital Services
          </h2>

          <p className="font-body text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Engineered for high-performing brands. From bespoke web design to mission-critical applications and commerce architectures.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Website Development */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Website Development
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm leading-relaxed">
                Ultra-responsive, visually captivating websites optimized for core web vitals, brand prestige, and maximum organic conversion.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
              <span></span>
              <Link
                to="/services"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-secondary group-hover:border-secondary transition-all duration-200"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: React Development */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                React Development
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm leading-relaxed">
                Component-driven web experiences built with modern React 19, Vite, and Next.js for blazing fast rendering and fluid state management.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
              <span></span>
              <Link
                to="/services"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-secondary group-hover:border-secondary transition-all duration-200"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Web Applications */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Web Applications
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm leading-relaxed">
                Full-stack web software, internal dashboards, and client portals engineered with secure REST/GraphQL backends and cloud resilience.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
              <span></span>
              <Link
                to="/services"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-secondary group-hover:border-secondary transition-all duration-200"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Shopify Development */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Shopify Development
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm leading-relaxed">
                High-converting headless Shopify Plus storefronts, custom Liquid sections, checkout extensions, and seamless third-party app pipelines.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
              <span></span>
              <Link
                to="/services"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-secondary group-hover:border-secondary transition-all duration-200"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* section 4: Process Section */}
      <ProcessSection />

    </div>
  );
}
