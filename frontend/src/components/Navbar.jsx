import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, ChevronDown, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md transition-colors duration-300 border-b border-secondary/15">
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-primary border border-secondary/40 shadow-[0_0_15px_rgba(1,255,219,0.15)] group-hover:shadow-[0_0_25px_rgba(1,255,219,0.4)] group-hover:border-secondary transition-all duration-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-secondary transform group-hover:rotate-12 transition-transform duration-300"
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
                <circle cx="12" cy="12" r="2.2" className="fill-primary stroke-secondary stroke-2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl tracking-wider text-white group-hover:text-secondary transition-colors duration-200">
                Floranex<span className="text-secondary">tech</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-body text-sm font-medium tracking-wide px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                    ? 'text-primary bg-secondary shadow-[inset_0_0_8px_rgba(1,255,219,0.15)] font-semibold'
                    : 'text-gray-300 hover:text-secondary hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Action / User Auth Area (Desktop) */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-secondary/10  text-white hover:border-secondary transition-all duration-200 cursor-pointer"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm hover:bg-white transition-all duration-300 ease-out">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-[#080808] border border-secondary/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200 z-50">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <div className="w-11 h-11 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center font-bold text-lg">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-lg text-white uppercase truncate tracking-wide">
                          {user?.name || "User Profile"}
                        </p>
                        <p className="font-body text-xs text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {/* Menu Actions */}
                    <div className="space-y-1">
                      <Link
                        to="/my-purchases"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-gray-300 hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-secondary" />
                        <span>My Purchases</span>
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-gray-300 hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-secondary" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/register"
                  className="relative inline-flex items-center justify-center px-6 py-2 mr-3 font-body text-sm font-semibold tracking-wide uppercase border text-secondary border-secondary hover:bg-secondary hover:text-primary rounded-lg active:scale-95 transition-all duration-200"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="relative inline-flex items-center justify-center px-6 py-2 font-body text-sm font-semibold tracking-wide uppercase border text-secondary border-secondary hover:bg-secondary hover:text-primary rounded-lg active:scale-95 transition-all duration-200"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-gray-300 hover:text-secondary hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-secondary/15 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `font-body px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
                      ? 'text-primary bg-secondary font-semibold'
                      : 'text-gray-300 hover:text-secondary hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-3 px-2 border-t border-white/10 mt-2">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base text-white truncate">{user?.name}</p>
                        <p className="font-body text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/my-purchases"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-secondary bg-secondary/10 border border-secondary/30 hover:bg-secondary hover:text-primary transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Purchases
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-secondary bg-secondary/10 border border-secondary/30 hover:bg-secondary hover:text-primary transition-all"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center px-5 py-2.5 font-body text-sm font-semibold tracking-wide uppercase text-primary bg-secondary rounded-lg shadow-[0_0_15px_rgba(1,255,219,0.3)] hover:bg-[#00e6c5] transition-all"
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center px-5 py-2.5 font-body text-sm font-semibold tracking-wide uppercase text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-primary transition-all"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
