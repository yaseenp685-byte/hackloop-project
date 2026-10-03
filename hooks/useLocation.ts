import { useState, useEffect, useCallback } from "react";
import { KARNATAKA_DISTRICTS, KarnatakaDistrict } from "@/lib/districts";

export type LocationPermissionState = "idle" | "requesting" | "granted" | "denied" | "unsupported";

export interface UserLocationState {
  coords: { latitude: number; longitude: number } | null;
  selectedDistrict: string | null;
  radiusKm: number | null; // e.g., 10, 25, 50, 100, or null (all Karnataka)
  permissionState: LocationPermissionState;
  errorMessage: string | null;
  isUsingBrowserLocation: boolean;
}

export function useLocation() {
  const [state, setState] = useState<UserLocationState>({
    coords: null,
    selectedDistrict: null,
    radiusKm: 25, // Default 25km search radius as requested in example
    permissionState: "idle",
    errorMessage: null,
    isUsingBrowserLocation: false,
  });

  const requestBrowserLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        permissionState: "unsupported",
        errorMessage: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, permissionState: "requesting", errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Find nearest Karnataka district
        let nearestDistrict: KarnatakaDistrict | null = null;
        let minDistance = Infinity;

        KARNATAKA_DISTRICTS.forEach((district) => {
          const dLat = district.latitude - latitude;
          const dLon = district.longitude - longitude;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);
          if (dist < minDistance) {
            minDistance = dist;
            nearestDistrict = district;
          }
        });

        setState((prev) => ({
          ...prev,
          coords: { latitude, longitude },
          selectedDistrict: nearestDistrict ? (nearestDistrict as KarnatakaDistrict).name : null,
          permissionState: "granted",
          isUsingBrowserLocation: true,
          errorMessage: null,
        }));
      },
      (error) => {
        let msg = "Could not access location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied. Please select a Karnataka district manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out.";
        }

        setState((prev) => ({
          ...prev,
          permissionState: "denied",
          errorMessage: msg,
          isUsingBrowserLocation: false,
        }));
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  const selectDistrict = useCallback((districtName: string | null) => {
    if (!districtName || districtName === "ALL") {
      setState((prev) => ({
        ...prev,
        selectedDistrict: null,
        coords: null,
        isUsingBrowserLocation: false,
      }));
      return;
    }

    const distObj = KARNATAKA_DISTRICTS.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase() || d.id === districtName.toLowerCase()
    );

    setState((prev) => ({
      ...prev,
      selectedDistrict: distObj ? distObj.name : districtName,
      coords: distObj ? { latitude: distObj.latitude, longitude: distObj.longitude } : null,
      isUsingBrowserLocation: false,
      errorMessage: null,
    }));
  }, []);

  const setRadiusKm = useCallback((radius: number | null) => {
    setState((prev) => ({ ...prev, radiusKm: radius }));
  }, []);

  const clearLocation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      coords: null,
      selectedDistrict: null,
      isUsingBrowserLocation: false,
      errorMessage: null,
    }));
  }, []);

  return {
    ...state,
    requestBrowserLocation,
    selectDistrict,
    setRadiusKm,
    clearLocation,
    districts: KARNATAKA_DISTRICTS,
  };
}
