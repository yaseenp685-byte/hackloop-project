"use client";

import React, { useState, useEffect } from "react";
import { ApiService } from "@/services/apiService";
import { Community } from "@/types/community";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Users, MapPin, Globe, Github, MessageSquare } from "lucide-react";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    ApiService.getCommunities().then((res) => {
      if (res.success && res.data) {
        setCommunities(res.data.data);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-3">
          <Users className="w-4 h-4" />
          <span>Developer Ecosystem</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Student &amp; Hackathon Communities Across Karnataka
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Grassroots student clubs, FOSS groups, and tech chapters uniting hackers to build projects and collaborate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((comm) => (
          <div
            key={comm.id}
            id={comm.id}
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {comm.type.replace("_", " ")}
                </span>
                <VerificationBadge status={comm.verificationStatus} source={comm.source} />
              </div>

              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                {comm.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{comm.district}</span>
                <span>• Lead: {comm.leadName}</span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                {comm.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {comm.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {comm.memberCount} Active Members
              </span>

              <div className="flex items-center gap-3">
                {comm.socialLinks?.github && (
                  <a
                    href={comm.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-neutral-900"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {comm.socialLinks?.website && (
                  <a
                    href={comm.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Website</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
