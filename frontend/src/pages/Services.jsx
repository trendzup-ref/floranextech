import { ArrowUpRight, Globe, Code2, Layers, ShoppingBag, Wrench, Server, Cloud, ShoppingCart, TrendingUp, Bot, ChartColumnIncreasing, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary text-white select-none">
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Subtle Grid pattern covering whole screen */}
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

      <section className="relative z-10 w-full  px-4 sm:px-6 lg:px-10 py-16 lg:py-16 flex flex-col items-center">
        {/* Section Heading */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center gap-4 mb-16 lg:mb-12">
          <h2 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold font-display leading-[0.88] uppercase">
            Services built to move your business forward
          </h2>

          <p className="font-body text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            From first prototype to scaled production system, our team covers the full stack so you don't have to coordinate five vendors.
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
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
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

          {/* Card 5: Website Maintenance */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Website Maintenance
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Ongoing updates, monitoring, and support that keep you shipping.
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

          {/* Card 6: Node.js Development */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Node.js Development
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Robust backend systems and APIs that scale with your business.
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

          {/* Card 7: SaaS Product Development */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                SaaS Product Development
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Design and develop scalable SaaS platforms that streamline business operations and support long-term growth.
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

          {/* Card 8: E-Commerce Development */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                E-Commerce Development
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Digital storefronts built to convert, from cart to checkout.
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

          {/* Card 9: Digital Marketing */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Digital Marketing
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Grow your business using performance-driven digital marketing strategies focused on increasing traffic, leads, and revenue.
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

          {/* Card 10: AI Automation */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                AI Automation
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Automate repetitive workflows and customer interactions using AI-powered systems that save time and improve efficiency.
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

          {/* Card 11: Analytics & Reporting */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <ChartColumnIncreasing className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                Analytics & Reporting
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                Measure every marketing effort using advanced analytics dashboards and business intelligence solutions.
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

          {/* Card 12: SEO optimisation */}
          <div className="group relative rounded-2xl md:rounded-3xl bg-primary/60 backdrop-blur-xl border border-white hover:border-secondary/60 p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(61,242,224,0.18)]">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight group-hover:text-secondary transition-colors duration-200">
                SEO Optimisation
              </h3>
              <p className="font-body text-gray-400 text-xs sm:text-sm ">
                improving a website's visibility, structure, and content so that it ranks higher in unpaid organic search engine results pages (SERPs) on platforms like Google, Bing, and AI-assisted search tools.
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
    </div>
  );
}
