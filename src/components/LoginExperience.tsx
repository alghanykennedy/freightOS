/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Ship, Lock, Mail, ChevronRight, Compass } from "lucide-react";
import { UserRole } from "../types";

interface LoginExperienceProps {
  onLogin: (email: string, role: UserRole) => void;
}

export default function LoginExperience({ onLogin }: LoginExperienceProps) {
  const [email, setEmail] = useState("alghany.t@freightos.com");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("Admin");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email, role);
    }
  };

  const selectDemoUser = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setRole(demoRole);
    onLogin(demoEmail, demoRole);
  };

  return (
    <div
      className="min-h-screen flex bg-slate-50 font-sans"
      id="login-container">
      {/* Left side: Premium illustration & value prop */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 text-white flex-col justify-between p-16 relative overflow-hidden"
        id="login-hero-panel">
        {/* Background decorative patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        {/* Header Logo */}
        <div
          className="flex items-center gap-3 relative z-10"
          id="login-logo-brand">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            <Compass className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <div>
            <span className="font-display font-bold text-2xl tracking-tight">
              Freight<span className="text-blue-300">OS</span>
            </span>
            <span className="block text-[10px] text-blue-200 tracking-widest uppercase font-mono">
              Digital Forwarding System
            </span>
          </div>
        </div>

        {/* Visual Illustration Section */}
        <div
          className="relative my-auto flex flex-col items-center justify-center py-10"
          id="login-illustration-container">
          {/* Stylized CSS Cargo Ship & Harbor Visual */}
          <div className="w-full max-w-md h-64 bg-blue-950/40 rounded-3xl border border-white/10 backdrop-blur-xl p-8 relative flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-blue-300 tracking-wider">
                VESSEL ENGINE / REALTIME STREAM
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-full border border-emerald-500/30">
                ● SYSTEM ONLINE
              </span>
            </div>

            {/* Container Stack Graphic */}
            <div className="my-auto flex flex-col items-center gap-4 relative">
              {/* Ship Silhouette */}
              <div className="w-56 h-8 bg-blue-400/20 rounded-b-xl border-t border-blue-300/30 relative flex items-center justify-center">
                <div className="absolute bottom-full left-1/3 w-8 h-10 bg-blue-400/10 border-t border-r border-blue-300/20"></div>
                <div className="absolute bottom-full left-1/2 w-12 h-6 bg-blue-400/15 border-t border-l border-blue-300/20"></div>
                {/* Containers stacked */}
                <div className="absolute bottom-full left-6 flex gap-1">
                  <div className="w-6 h-5 bg-blue-500 rounded-sm border border-blue-400 flex items-center justify-center text-[8px] font-mono text-white">
                    40
                  </div>
                  <div className="w-6 h-5 bg-amber-500 rounded-sm border border-amber-400 flex items-center justify-center text-[8px] font-mono text-white">
                    40
                  </div>
                </div>
                <div className="absolute bottom-full right-8 flex gap-1">
                  <div className="w-6 h-5 bg-emerald-500 rounded-sm border border-emerald-400 flex items-center justify-center text-[8px] font-mono text-white">
                    20
                  </div>
                  <div className="w-6 h-5 bg-cyan-500 rounded-sm border border-cyan-400 flex items-center justify-center text-[8px] font-mono text-white">
                    40
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-200 uppercase tracking-widest font-semibold mt-1">
                  FREIGHTOS DISPATCH
                </span>
              </div>
              {/* Dynamic Ocean Ripples */}
              <div className="flex gap-1.5 mt-2 animate-pulse">
                <div className="w-12 h-1 bg-blue-300/30 rounded-full"></div>
                <div className="w-24 h-1 bg-blue-300/40 rounded-full"></div>
                <div className="w-16 h-1 bg-blue-300/30 rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-between items-end text-xs text-blue-300">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-blue-400">
                  Current Port
                </span>
                <span className="font-semibold text-white">
                  Tanjung Priok, ID (CGK)
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-wider text-blue-400">
                  Total Active TEUs
                </span>
                <span className="font-semibold text-white font-mono">
                  1,480 / 1,500
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 max-w-sm">
            <h1 className="text-2xl font-display font-semibold tracking-tight text-white mb-3">
              Enterprise Digital Logistics
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Consolidate shipments, commercial documents, PIB clearance, and
              multi-leg tasks into a single real-time operational operating
              system.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-between items-center text-xs text-blue-200/60 font-mono"
          id="login-footer-info">
          <span>FreightOS v1.4.0</span>
          <span>© 2026 FreightOS Global Inc.</span>
        </div>
      </div>

      {/* Right side: Modern Glassmorphic Login Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative bg-slate-50"
        id="login-form-panel">
        <div
          className="w-full max-w-md bg-white border border-slate-200/80 p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-100/50 relative z-10"
          id="login-form-card">
          <div className="text-center mb-8">
            <div
              className="lg:hidden flex justify-center items-center gap-2 mb-4"
              id="login-mobile-brand">
              <Compass className="w-8 h-8 text-blue-600 animate-spin-slow" />
              <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Freight<span className="text-blue-600">OS</span>
              </span>
            </div>
            <h2 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">
              Welcome to FreightOS
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to manage import/export workflows
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div>
              <label
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                htmlFor="email-input">
                Work Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  htmlFor="password-input">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs font-medium text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Reset password link has been sent to your email.");
                  }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Simulated RBAC Role Picker on Login for instant testing */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Simulated Login Role
              </label>
              <div
                className="grid grid-cols-5 gap-1.5"
                id="login-role-selector">
                {(
                  [
                    "Admin",
                    "Manager",
                    "Operations",
                    "Sales",
                    "Finance",
                  ] as UserRole[]
                ).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
                      role === r
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100/80"
                    }`}
                    onClick={() => setRole(r)}>
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Selecting a role configures RBAC dashboard permissions
                automatically.
              </p>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-xs font-medium text-slate-600">
                  Keep me logged in
                </span>
              </label>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-200/50 transition-all text-sm cursor-pointer">
              Sign In to System
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social login line */}
          <div className="relative my-6" id="login-divider">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-150"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-mono text-[9px] tracking-wider">
                or bypass with team demo
              </span>
            </div>
          </div>

          {/* Quick Demo Logins for instant review */}
          <div className="space-y-2" id="login-demo-profiles">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center">
              Quick Profile Onboarding
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-all"
                onClick={() => selectDemoUser("alghany.t@freightos.com", "Admin")}>
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40&q=80"
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-800">
                      Alghany K.
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase font-semibold">
                      Admin
                    </span>
                  </div>
                </div>
              </button>
              <button
                type="button"
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-left transition-all"
                onClick={() =>
                  selectDemoUser("raka.a@freightos.com", "Operations")
                }>
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80"
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-800">
                      Raka A.
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase font-semibold">
                      Operations
                    </span>
                  </div>
                </div>
              </button>
            </div>
            <button
              type="button"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              onClick={() =>
                selectDemoUser("sarah.j@freightos.com", "Manager")
              }>
              <span>Login as Sarah J. (Manager)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
