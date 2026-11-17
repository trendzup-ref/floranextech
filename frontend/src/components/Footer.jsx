import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Contact', path: '/contact' },
];

const serviceLinks = [
  { name: 'SEO Optimization', path: '/services' },
  { name: 'Performance Marketing', path: '/services' },
  { name: 'Social Media Management', path: '/services' },
  { name: 'Web Development', path: '/services' },
  { name: 'Branding & Design', path: '/services' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary border-t border-secondary/15 text-gray-300 font-body overflow-hidden">
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Brand & Bio & Socials */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary border border-secondary/40 shadow-[0_0_15px_rgba(61,242,224,0.2)] group-hover:border-secondary transition-all duration-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-secondary transform group-hover:rotate-12 transition-transform duration-300"
                >
                  <path
                    d="M12 2C12 2 14.5 6.5 14.5 9.5C14.5 10.88 13.38 12 12 12C10.62 12 9.5 10.88 9.5 9.5C9.5 6.5 12 2 12 2Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M22 12C22 12 17.5 14.5 14.5 14.5C13.12 14.5 12 13.38 12 12C12 10.62 13.12 9.5 14.5 9.5C17.5 9.5 22 12 22 12Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M12 22C12 22 9.5 17.5 9.5 14.5C9.5 13.12 10.62 12 12 12C13.38 12 14.5 13.12 14.5 14.5C14.5 17.5 12 22 12 22Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M2 12C2 12 6.5 9.5 9.5 9.5C10.88 9.5 12 10.62 12 12C12 13.38 10.88 14.5 9.5 14.5C6.5 14.5 2 12 2 12Z"
                    fill="currentColor"
                    fillOpacity="0.85"
                  />
                  <circle cx="12" cy="12" r="2" className="fill-primary stroke-secondary stroke-2" />
                </svg>
              </div>
              <span className="font-display text-2xl tracking-wider text-white">
                Floranextech
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Accelerating Brands Through Intelligent Digital Marketing & Nature-Inspired Computational Engineering. We blend performance data with cutting-edge creativity to drive scalable business growth globally.
            </p>

            {/* Circular Action / Social Buttons (WhatsApp, Mail, Phone) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-secondary hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-[0_0_12px_rgba(61,242,224,0.3)] transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:floranextech@gmail.com"
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-secondary hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-[0_0_12px_rgba(61,242,224,0.3)] transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+919310563727"
                aria-label="Phone"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-secondary hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-[0_0_12px_rgba(61,242,224,0.3)] transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display tracking-wider text-lg text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-secondary transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display tracking-wider text-lg text-white uppercase">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display tracking-wider text-lg text-white uppercase">
              Contact Us
            </h3>
            <div className="space-y-4 text-sm">
              {/* Headquarters */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-[0_0_10px_rgba(61,242,224,0.15)]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-white text-xs uppercase tracking-wider mb-0.5">
                    Headquarters
                  </span>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Trendzupmedia Creations Pvt.Ltd. 307/3rd Floor Vardhaman Gee Dee Plaza Building, Dwarka Sector 12, New Delhi 110075
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-[0_0_10px_rgba(61,242,224,0.15)]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-white text-xs uppercase tracking-wider mb-0.5">
                    Phone
                  </span>
                  <a
                    href="tel:+919310563727"
                    className="text-gray-400 hover:text-secondary text-xs transition-colors"
                  >
                    +91 9310563727
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-[0_0_10px_rgba(61,242,224,0.15)]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-semibold text-white text-xs uppercase tracking-wider mb-0.5">
                    Email
                  </span>
                  <a
                    href="mailto:floranextech@gmail.com"
                    className="block text-gray-400 hover:text-secondary text-xs transition-colors"
                  >
                    floranextech@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} Floranextech. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-secondary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

