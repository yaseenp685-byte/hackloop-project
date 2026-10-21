"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Compass,
  Briefcase,
  KeyRound,
  UserCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";
import { ApiService } from "@/services/apiService";

interface AuthCardProps {
  initialTab?: "signin" | "signup";
  initialRole?: "STUDENT" | "ORGANIZER";
  redirectUrl?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  initialTab = "signin",
  initialRole = "STUDENT",
  redirectUrl,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params can override initial tab and role
  const urlTab = searchParams?.get("tab") === "signup" ? "signup" : searchParams?.get("tab") === "signin" ? "signin" : initialTab;
  const urlRole = searchParams?.get("role")?.toUpperCase() === "ORGANIZER" ? "ORGANIZER" : initialRole;

  const [activeTab, setActiveTab] = useState<"signin" | "signup">(urlTab);
  const [role, setRole] = useState<"STUDENT" | "ORGANIZER">(urlRole);

  // Common input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Student specific states
  const [usnOrRollNo, setUsnOrRollNo] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [universityName, setUniversityName] = useState("Visvesvaraya Technological University (VTU)");
  const [district, setDistrict] = useState("Bengaluru Urban");
  const [degreeBranch, setDegreeBranch] = useState("Computer Science & Engineering");
  const [graduationYear, setGraduationYear] = useState<number>(2026);

  // Organizer specific states
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("COLLEGE");
  const [designation, setDesignation] = useState("Faculty Coordinator");

  // UI interaction states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // 0 to 4
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthLabel = (score: number) => {
    if (!password) return { label: "Enter a password", color: "bg-neutral-200 dark:bg-neutral-800", textColor: "text-neutral-400" };
    if (score <= 1) return { label: "Weak (add uppercase, number or symbol)", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400" };
    if (score === 2) return { label: "Fair (mix letters & numbers)", color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400" };
    if (score === 3) return { label: "Good (almost there)", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400" };
    return { label: "Strong & Secure", color: "bg-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400" };
  };

  // Switch tabs cleanly
  const handleTabSwitch = (newTab: "signin" | "signup") => {
    setActiveTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Demo 1-click accounts
  const handlePreFillDemo = (demoType: "student" | "organizer" | "admin") => {
    setActiveTab("signin");
    setErrorMsg(null);
    setSuccessMsg(null);

    if (demoType === "student") {
      setRole("STUDENT");
      setEmail("karan.gowda@rvce.edu.in");
      setPassword("Password@123");
    } else if (demoType === "organizer") {
      setRole("ORGANIZER");
      setEmail("sandhya.v@rvce.edu.in");
      setPassword("Password@123");
    } else {
      setEmail("admin@karnatakahackathons.gov.in");
      setPassword("Admin@123");
    }
  };

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await ApiService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccessMsg(`Welcome back, ${result.user?.name || "User"}! Redirecting...`);

      // Determine redirect destination
      let dest = redirectUrl;
      if (!dest) {
        if (result.user?.role === "ADMIN") dest = "/admin";
        else if (result.user?.role === "ORGANIZER") dest = "/dashboard/organizer";
        else dest = "/dashboard/student";
      }

      setTimeout(() => {
        router.push(dest as string);
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
      setLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation checks
    if (!name.trim()) {
      setErrorMsg("Please provide your full legal or display name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid educational or institutional email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long for safety.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password confirmation does not match the chosen password.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        phone: phone.trim() || undefined,
      };

      if (role === "STUDENT") {
        payload.usnOrRollNo = usnOrRollNo.trim() || undefined;
        payload.collegeName = collegeName.trim() || "Karnataka Engineering College";
        payload.universityName = universityName.trim() || undefined;
        payload.district = district;
        payload.graduationYear = graduationYear;
        payload.degreeBranch = degreeBranch.trim() || undefined;
      } else {
        payload.organizationName = organizationName.trim() || "Karnataka Technical Institute";
        payload.organizationType = organizationType;
        payload.designation = designation.trim() || "Event Coordinator";
        payload.district = district;
      }

      // Safe registration in backend database
      const result = await ApiService.register(payload);

      setRegisteredEmail(email.trim().toLowerCase());
      setSuccessMsg(
        `🎉 Account created and securely saved in the database! You can now access your ${
          role === "STUDENT" ? "Student" : "Organizer"
        } portal.`
      );

      // Offer immediate redirect or let user test the newly stored credentials in Sign In
      const dest =
        redirectUrl || (role === "ORGANIZER" ? "/dashboard/organizer" : "/dashboard/student");

      setTimeout(() => {
        router.push(dest);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please check your details and try again.");
      setLoading(false);
    }
  };

  const strength = getStrengthLabel(passwordStrength);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Decorative ambient background blur */}
      <div className="relative">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-red-500/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-500/10 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Main Card Container */}
        <div className="relative bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all">
          {/* Header Title & Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-karnataka-red dark:text-red-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-karnataka-red animate-pulse" />
              Karnataka State Portal Authentication
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              {activeTab === "signin" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
              {activeTab === "signin"
                ? "Sign in to manage registrations, teams, hackathon events and submissions across Karnataka."
                : "Join thousands of students and organizers discovering technology events across Karnataka's 31 districts."}
            </p>
          </div>

          {/* Unified Animated Tab Switcher */}
          <div className="flex p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 mb-6 border border-neutral-200/80 dark:border-neutral-700/80">
            <button
              type="button"
              onClick={() => handleTabSwitch("signin")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "signin"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "signup"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Authentication Notice:</span> {errorMsg}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-bold">{successMsg}</p>
                {registeredEmail && activeTab === "signup" && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Your login email is <span className="font-mono font-semibold">{registeredEmail}</span>. Data is securely stored in the system database.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Role Selector Pill Toggle */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Select Your Role / Purpose
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  role === "STUDENT"
                    ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    role === "STUDENT"
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Student / Hacker</div>
                  <div className="text-[10px] opacity-75">Teams & Events</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("ORGANIZER")}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  role === "ORGANIZER"
                    ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    role === "ORGANIZER"
                      ? "bg-amber-600 text-white"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Event Organizer</div>
                  <div className="text-[10px] opacity-75">Host & Review</div>
                </div>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: SIGN IN FORM */}
          {/* ============================================================== */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "STUDENT" ? "karan.gowda@rvce.edu.in" : "organizer@college.edu.in"
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <span className="text-[11px] text-neutral-400 hover:text-brand-600 cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me and safe session */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Keep me signed in for 7 days (Secure Cookie)</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-neutral-400 cursor-not-allowed"
                    : role === "STUDENT"
                    ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                    : "bg-amber-600 hover:bg-amber-700 active:scale-[0.99]"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials & Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {role === "STUDENT" ? "Student Dashboard" : "Organizer Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Evaluation Shortcuts */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>1-Click Test Credentials (Pre-Seeded)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreFillDemo("student")}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Student</span>
                    </div>
                    <div className="text-[10px] text-blue-700 dark:text-blue-300 truncate">
                      karan.gowda@rvce...
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreFillDemo("organizer")}
                    className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Organizer</span>
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-300 truncate">
                      sandhya.v@rvce...
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreFillDemo("admin")}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </div>
                    <div className="text-[10px] text-red-700 dark:text-red-300 truncate">
                      admin@karnataka...
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 2: SIGN UP FORM */}
          {/* ============================================================== */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "STUDENT" ? "e.g., Ananya Hegde" : "e.g., Prof. Ramesh Kumar"}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu.in"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Role-Specific Fields: STUDENT */}
              {role === "STUDENT" && (
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-3">
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Profile Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        USN / Roll Number
                      </label>
                      <input
                        type="text"
                        value={usnOrRollNo}
                        onChange={(e) => setUsnOrRollNo(e.target.value)}
                        placeholder="e.g. 1RV22CS099"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white uppercase outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="e.g. R.V. College of Engineering"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Karnataka District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                      >
                        {KARNATAKA_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Branch & Grad Year
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={degreeBranch}
                          onChange={(e) => setDegreeBranch(e.target.value)}
                          placeholder="CSE / ISE / ECE"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                        />
                        <select
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(Number(e.target.value))}
                          className="w-20 px-2 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                        >
                          <option value={2025}>2025</option>
                          <option value={2026}>2026</option>
                          <option value={2027}>2027</option>
                          <option value={2028}>2028</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Role-Specific Fields: ORGANIZER */}
              {role === "ORGANIZER" && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    <span>Organizer Profile Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Organization / College Name
                      </label>
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. BMS College of Engineering"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Organization Type
                      </label>
                      <select
                        value={organizationType}
                        onChange={(e) => setOrganizationType(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                      >
                        <option value="COLLEGE">Engineering College / Institute</option>
                        <option value="UNIVERSITY">State / Deemed University</option>
                        <option value="COMPANY">Tech Company / Enterprise</option>
                        <option value="COMMUNITY">Developer Club / Community</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Faculty Coordinator / Hackathon Lead"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Karnataka District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-hidden"
                      >
                        {KARNATAKA_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border ${
                          confirmPassword && password !== confirmPassword
                            ? "border-red-400 focus:ring-red-400"
                            : "border-neutral-300 dark:border-neutral-700 focus:ring-brand-500"
                        } bg-neutral-50 dark:bg-neutral-800/70 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 outline-hidden transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Security Strength:</span>
                      <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      <div
                        className={`rounded-full transition-all ${
                          passwordStrength >= 1 ? strength.color : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                      />
                      <div
                        className={`rounded-full transition-all ${
                          passwordStrength >= 2 ? strength.color : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                      />
                      <div
                        className={`rounded-full transition-all ${
                          passwordStrength >= 3 ? strength.color : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                      />
                      <div
                        className={`rounded-full transition-all ${
                          passwordStrength >= 4 ? strength.color : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                      />
                    </div>
                    {confirmPassword && (
                      <div className="pt-1 flex items-center gap-1.5 text-[11px]">
                        {password === confirmPassword ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Safety & Terms notice */}
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                By registering, your account and credentials are encrypted using industry-standard bcrypt hashing
                and securely stored in the Karnataka Hackathon Portal database under state privacy standards.
              </p>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-neutral-400 cursor-not-allowed"
                    : role === "STUDENT"
                    ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                    : "bg-amber-600 hover:bg-amber-700 active:scale-[0.99]"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Account to Database...</span>
                  </>
                ) : (
                  <>
                    <span>Create My Account & Save Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switcher Footer */}
          <div className="mt-8 pt-5 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
            {activeTab === "signin" ? (
              <p>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signup")}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                >
                  Create one now (Sign Up)
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signin")}
                  className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                >
                  Sign in with your email & password
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

