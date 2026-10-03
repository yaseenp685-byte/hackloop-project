"use client";

import React, { useState } from "react";
import { KARNATAKA_DISTRICTS } from "@/lib/districts";
import { MapPin, Navigation, Compass, AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationSelectorProps {
  selectedDistrict: string | null;
  radiusKm: number | null;
  isUsingBrowserLocation: boolean;
  permissionState: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  errorMessage: string | null;
  onRequestBrowserLocation: () => void;
  onSelectDistrict: (district: string | null) => void;
  onSetRadiusKm: (radius: number | null) => void;
  onClearLocation: () => void;
  className?: string;
  compact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedDistrict,
  radiusKm,
  isUsingBrowserLocation,
  permissionState,
  errorMessage,
  onRequestBrowserLocation,
  onSelectDistrict,
  onSetRadiusKm,
  onClearLocation,
  className,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const radiusOptions = [
    { label: "Within 10 km", value: 10 },
    { label: "Within 25 km", value: 25 },
    { label: "Within 50 km", value: 50 },
    { label: "Within 100 km", value: 100 },
    { label: "All Karnataka", value: null },
  ];

  return (
    <div className={cn("relative inline-block text-left w-full sm:w-auto", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-between w-full gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all focus:outline-hidden focus:ring-2 focus:ring-brand-500",
          selectedDistrict || isUsingBrowserLocation
            ? "bg-blue-50/70 border-blue-300 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200"
            : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
        )}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className={cn("w-4 h-4 shrink-0", selectedDistrict ? "text-brand-600" : "text-neutral-500")} />
          <span className="truncate">
            {isUsingBrowserLocation && selectedDistrict
              ? `Nearby: ${selectedDistrict}`
              : selectedDistrict
              ? selectedDistrict
              : "Location / Karnataka District"}
          </span>
          {radiusKm && selectedDistrict && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-medium">
              &le;{radiusKm}km
            </span>
          )}
        </div>
        <Compass className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
      </button>

      {/* Dropdown Modal/Popout */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-80 sm:w-96 right-0 sm:right-auto sm:left-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-4 text-neutral-800 dark:text-neutral-100"
          role="dialog"
          aria-label="Location and Distance Filter"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 font-semibold text-sm">
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Location-Aware Discovery</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close location selector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Browser Location Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                onRequestBrowserLocation();
              }}
              disabled={permissionState === "requesting"}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors",
                isUsingBrowserLocation
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-700"
              )}
            >
              <Navigation className={cn("w-3.5 h-3.5", permissionState === "requesting" && "animate-spin")} />
              {permissionState === "requesting"
                ? "Locating nearby..."
                : isUsingBrowserLocation
                ? "Using Device Location (Active)"
                : "Detect My Current Location"}
            </button>

            {/* Permission feedback / errors */}
            {permissionState === "denied" && errorMessage && (
              <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Manual Karnataka District Selection */}
          <div className="mt-3">
            <label htmlFor="district-select" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Or Select Karnataka District / Tech Hub
            </label>
            <select
              id="district-select"
              value={selectedDistrict || "ALL"}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">Entire Karnataka (All 31 Districts)</option>
              <optgroup label="Major Tech & Innovation Hubs">
                <option value="Bengaluru Urban">Bengaluru Urban (Koramangala, Whitefield, HSR)</option>
                <option value="Mysuru">Mysuru (Hebbal, JSS, Infosys Hub)</option>
                <option value="Dakshina Kannada (Mangaluru)">Dakshina Kannada (Mangaluru / Surathkal)</option>
                <option value="Dharwad (Hubballi-Dharwad)">Dharwad (Hubballi IT Park, KLE Tech)</option>
                <option value="Udupi">Udupi / Manipal</option>
                <option value="Kalaburagi (Gulbarga)">Kalaburagi (Kalyana Karnataka)</option>
              </optgroup>
              <optgroup label="All Karnataka Districts">
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.division} Division)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Radius Selector */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Distance Radius (from selected area)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {radiusOptions.map((opt) => {
                const isSelected = radiusKm === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => onSetRadiusKm(opt.value)}
                    className={cn(
                      "py-1 px-1.5 text-[11px] rounded border font-medium text-center transition-colors",
                      isSelected
                        ? "bg-brand-600 text-white border-brand-700"
                        : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClearLocation();
                setIsOpen(false);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
            >
              Reset Location
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="py-1 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
