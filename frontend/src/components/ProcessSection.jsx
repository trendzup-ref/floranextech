import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Lightbulb,
  Target,
  PenTool,
  Code2,
  Rocket,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const processSteps = [
  {
    id: 1,
    title: "1. Discovery",
    icon: Search,
    summary:
      "Deep dive into your business model, competitive landscape, growth bottlenecks, and core value proposition.",
    details:
      "We interview key stakeholders, audit your existing brand touchpoints, review performance data, and establish north-star KPIs for the partnership.",
  },
  {
    id: 2,
    title: "2. Research",
    icon: Lightbulb,
    summary:
      "Exhaustive audience intelligence, competitor funnel breakdowns, and tech-stack feasibility analysis.",
    details:
      "We identify high-intent buyer personas, analyze keyword search volumes, dissect top-ranking competitors, and map out friction points across existing user journeys.",
  },
  {
    id: 3,
    title: "3. Strategy",
    icon: Target,
    summary:
      "Bespoke growth roadmap, conversion-first architectural blueprints, and full-funnel marketing strategies.",
    details:
      "We formulate comprehensive channel attribution models, design wireframe architectures, and schedule clear sprint milestones for development and campaign launches.",
  },
  {
    id: 4,
    title: "4. Design",
    icon: PenTool,
    summary:
      "High-impact visual identity, responsive Figma design systems, and micro-interaction prototypes.",
    details:
      "Crafting pixel-perfect, accessibility-compliant user interfaces that establish instant trust, elevate brand prestige, and guide visitors smoothly into buyers.",
  },
  {
    id: 5,
    title: "5. Development",
    icon: Code2,
    summary:
      "Production-grade engineering built on React 19, headless systems, clean APIs, and lightning-fast loading speeds.",
    details:
      "Writing modular, maintainable code with strict Core Web Vital standards, responsive layouts, search engine optimization metadata, and secure backend hooks.",
  },
  {
    id: 6,
    title: "6. Launch & Optimization",
    icon: Rocket,
    summary:
      "Zero-downtime deployment, continuous analytics tracking, heatmapping, and data-backed iteration.",
    details:
      "Post-launch telemetry, multivariate A/B testing on hero copy and checkout flows, server caching calibration, and ongoing conversion rate optimization.",
  },
];

export default function ProcessSection() {
  const [openStep, setOpenStep] = useState(1);

  const toggleStep = (id) => {
    setOpenStep((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 select-none">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-12 lg:mb-12">
        <h2 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold font-display leading-[0.9] tracking-[0.002em] uppercase">
          Our Proven Process
        </h2>

        <p className="font-body text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          A systematic, data-driven approach to predictable growth. We leave nothing to chance.
        </p>
      </div>

      {/* Process Timeline & Accordion */}
      <div className="relative flex flex-col gap-5 sm:gap-6">
        {/* Continuous vertical timeline connector line */}
        <div className="hidden sm:block absolute left-5 top-7 bottom-7 w-px bg-gradient-to-b from-secondary/40 via-white/10 to-secondary/40 -z-0" />

        {processSteps.map((step) => {
          const Icon = step.icon;
          const isOpen = openStep === step.id;

          return (
            <div key={step.id} className="relative flex items-start gap-3 sm:gap-8 z-10">
              {/* Left Timeline Icon Node */}
              <div
                onClick={() => toggleStep(step.id)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 mt-2 sm:mt-1.5 ${isOpen
                  ? "bg-secondary text-primary shadow-[0_0_20px_rgba(61,242,224,0.45)] scale-110 border border-secondary"
                  : "bg-primary/90 text-gray-400 border border-white/15 hover:border-secondary/50 hover:text-secondary hover:bg-secondary/10"
                  }`}
                aria-label={`Toggle step ${step.id}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
              </div>

              {/* Right Accordion Box */}
              <div
                onClick={() => toggleStep(step.id)}
                className={`flex-1 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${isOpen
                  ? "bg-primary/85 border-secondary/60 shadow-[0_0_30px_rgba(61,242,224,0.12)]"
                  : "bg-primary/60 border-white/10 hover:border-white/25 hover:bg-primary/75"
                  } p-5 sm:p-7`}
              >
                {/* Accordion Top Header */}
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={`font-display text-2xl sm:text-3xl tracking-wide uppercase leading-tight transition-colors duration-200 ${isOpen ? "text-secondary" : "text-white"
                      }`}
                  >
                    {step.title}
                  </h3>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                      ? "text-secondary bg-secondary/10 rotate-180"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    <ChevronDown className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* Collapsible Details */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 sm:pt-5 border-t border-white/10 mt-4 space-y-2">
                        <p className="font-body text-sm sm:text-base text-gray-200 font-medium leading-relaxed">
                          {step.summary}
                        </p>
                        <p className="font-body text-xs sm:text-sm text-gray-400 leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

