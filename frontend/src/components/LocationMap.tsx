"use client";

import { useEffect, useId } from "react";

export type MapMarker = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  subtitle?: string;
  color?: string;
};

type Props = {
  center: { latitude: number; longitude: number };
  markers: MapMarker[];
  zoom?: number;
  className?: string;
};

declare global {
  interface Window {
    L?: {
      map: (el: HTMLElement, opts?: object) => {
        setView: (latlng: [number, number], zoom: number) => unknown;
        remove: () => void;
      };
      tileLayer: (url: string, opts?: object) => { addTo: (map: unknown) => unknown };
      circleMarker: (
        latlng: [number, number],
        opts?: object,
      ) => {
        addTo: (map: unknown) => { bindPopup: (html: string) => unknown };
      };
    };
  }
}

export default function LocationMap({ center, markers, zoom = 12, className = "" }: Props) {
  const mapId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    let map: { remove: () => void } | null = null;

    async function init() {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Leaflet"));
          document.body.appendChild(script);
        });
      }

      if (cancelled || !window.L) return;
      const el = document.getElementById(`map-${mapId}`);
      if (!el) return;

      const L = window.L;
      const instance = L.map(el);
      instance.setView([center.latitude, center.longitude], zoom);
      map = instance as unknown as { remove: () => void };

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(instance);

      for (const marker of markers) {
        if (Number.isNaN(marker.latitude) || Number.isNaN(marker.longitude)) continue;
        L.circleMarker([marker.latitude, marker.longitude], {
          radius: 8,
          color: marker.color ?? "#dc2626",
          fillColor: marker.color ?? "#dc2626",
          fillOpacity: 0.85,
        })
          .addTo(instance)
          .bindPopup(
            `<strong>${marker.name}</strong>${marker.subtitle ? `<br/>${marker.subtitle}` : ""}`,
          );
      }
    }

    init().catch(() => undefined);
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [center.latitude, center.longitude, mapId, markers, zoom]);

  return (
    <div
      id={`map-${mapId}`}
      className={`h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${className}`}
    />
  );
}
