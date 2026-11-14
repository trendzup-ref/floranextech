import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, ArrowRight } from "lucide-react";
import { registerUser } from "@/api/authApi.js";
import { useAuth } from "@/context";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      const response = await registerUser({ name, email, password });
      if (response?.success) {
        await fetchUser();
        navigate("/");
      } else {
        setError(response?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary text-white select-none flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* Main Register Card Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card Form */}
        <div className="rounded-2xl md:rounded-3xl bg-primary/70 backdrop-blur-xl border border-white/10 hover:border-secondary/40 p-7 sm:p-9 shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-all duration-300">
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">
              Create an Account
            </h1>
            <p className="font-body text-xs sm:text-sm text-gray-400 mt-1">
              Start your journey with Floranextech
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5" noValidate>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs uppercase tracking-wider text-gray-300 font-semibold">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white placeholder-gray-500 text-sm font-body outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors p-1"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-body text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full font-display font-bold text-md rounded-md tracking-[0.10em] uppercase text-primary bg-secondary border-secondary/50 py-3.5  hover:scale-[1.02]  hover:bg-white transition-all duration-300 ease-out cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Register
                  </span>
                )}
              </button>
            </div>

            {/* Redirect to Login */}
            <p className="text-center font-body text-xs text-gray-400 pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-secondary font-semibold hover:underline ml-1 inline-flex items-center gap-1 group"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;
