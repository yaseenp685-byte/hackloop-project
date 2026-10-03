import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, ExternalLink, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-karnataka-red to-karnataka-yellow flex items-center justify-center text-white font-bold text-xs">
                K
              </div>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">
                Karnataka Hackathon Community
              </span>
            </div>
            <p className="leading-relaxed">
              Centralized search engine and digital middle layer connecting students, colleges, universities, companies, and organizers across all 31 districts of Karnataka.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Independent Open Ecosystem Initiative</span>
            </div>
          </div>

          {/* Quick Discovery */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Discovery Engine
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search?category=HACKATHONS" className="hover:text-brand-600 transition-colors">
                  Upcoming Hackathons
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-brand-600 transition-colors">
                  Colleges & Universities
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-brand-600 transition-colors">
                  Participating Companies
                </Link>
              </li>
              <li>
                <Link href="/communities" className="hover:text-brand-600 transition-colors">
                  Student Tech Communities
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Karnataka Hubs */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Karnataka Regional Hubs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search?district=Bengaluru+Urban" className="hover:text-brand-600 transition-colors">
                  Bengaluru Urban (Tech Capital)
                </Link>
              </li>
              <li>
                <Link href="/search?district=Mysuru" className="hover:text-brand-600 transition-colors">
                  Mysuru Cluster
                </Link>
              </li>
              <li>
                <Link href="/search?district=Dakshina+Kannada+(Mangaluru)" className="hover:text-brand-600 transition-colors">
                  Mangaluru & Coastal Belt
                </Link>
              </li>
              <li>
                <Link href="/search?district=Dharwad+(Hubballi-Dharwad)" className="hover:text-brand-600 transition-colors">
                  Hubballi-Dharwad & Belagavi
                </Link>
              </li>
              <li>
                <Link href="/search?district=Kalaburagi+(Gulbarga)" className="hover:text-brand-600 transition-colors">
                  Kalaburagi (Kalyana Karnataka)
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Roles */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Portals & Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login/student" className="hover:text-brand-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login/organizer" className="hover:text-brand-600 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login/admin" className="hover:text-brand-600 transition-colors">
                  Administrator Console
                </Link>
              </li>
              <li>
                <Link href="/docs/API_FRONTEND_REQUIREMENTS.md" className="hover:text-brand-600 transition-colors">
                  Backend API Specs (Docs)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer on Verification & Official Data */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 space-y-1">
          <p>
            Transparency Note: Platform listings carry clear verification tags (VERIFIED, UNVERIFIED, PENDING, STALE). Official state affiliations are verified via KSHEC & VTU data ingestion workers. Unverified community submissions do not represent official endorsements.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>&copy; {new Date().getFullYear()} Karnataka Hackathon Community & Discovery Portal. Built with Next.js & Tailwind CSS.</div>
            <div className="flex items-center gap-1">
              <span>Empowering student innovators across Karnataka</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
