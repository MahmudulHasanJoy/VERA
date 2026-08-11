"use client";

import { useEffect, useId, useRef } from "react";

export type MapMarker = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  subtitle?: string;
  color?: string;
};

type LeafletMap = {
  setView: (latlng: [number, number], zoom: number) => unknown;
  flyTo?: (latlng: [number, number], zoom?: number) => unknown;
  invalidateSize?: () => unknown;
  on: (event: string, handler: (e: { latlng: { lat: number; lng: number } }) => void) => unknown;
  remove: () => void;
};

type LeafletLayerGroup = {
  clearLayers: () => void;
  addLayer: (layer: unknown) => unknown;
  addTo: (map: LeafletMap) => LeafletLayerGroup;
};

type LeafletLib = {
  map: (el: HTMLElement, opts?: object) => LeafletMap;
  tileLayer: (url: string, opts?: object) => { addTo: (map: LeafletMap) => unknown };
  circleMarker: (
    latlng: [number, number],
    opts?: object,
  ) => {
    addTo: (map: LeafletMap | LeafletLayerGroup) => { bindPopup: (html: string) => unknown };
  };
  layerGroup: () => LeafletLayerGroup;
};

type Props = {
  center: { latitude: number; longitude: number };
  markers: MapMarker[];
  zoom?: number;
  className?: string;
  pickable?: boolean;
  pickMarker?: { latitude: number; longitude: number; label?: string };
  onLocationPick?: (latitude: number, longitude: number) => void;
};

declare global {
  interface Window {
    L?: LeafletLib;
  }
}

let leafletPromise: Promise<LeafletLib> | null = null;

function loadLeaflet(): Promise<LeafletLib> {
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error("Leaflet failed to load"));
    };
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.body.appendChild(script);
  });

  return leafletPromise;
}

export default function LocationMap({
  center,
  markers,
  zoom = 12,
  className = "",
  pickable = false,
  pickMarker,
  onLocationPick,
}: Props) {
  const mapId = useId().replace(/:/g, "");
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LeafletLayerGroup | null>(null);
  const pickLayerRef = useRef<LeafletLayerGroup | null>(null);
  const onPickRef = useRef(onLocationPick);
  const pickableRef = useRef(pickable);
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);

  onPickRef.current = onLocationPick;
  pickableRef.current = pickable;
  centerRef.current = center;
  zoomRef.current = zoom;

  const centerLat = center.latitude;
  const centerLng = center.longitude;
  const pickLat = pickMarker?.latitude ?? null;
  const pickLng = pickMarker?.longitude ?? null;
  const pickLabel = pickMarker?.label ?? null;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = await loadLeaflet();
      if (cancelled) return;

      const el = document.getElementById(`map-${mapId}`);
      if (!el || mapRef.current) return;

      const initialCenter = centerRef.current;
      const initialZoom = zoomRef.current;
      const map = L.map(el, { scrollWheelZoom: true });
      map.setView([initialCenter.latitude, initialCenter.longitude], initialZoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup();
      markersLayer.addTo(map);
      markersLayerRef.current = markersLayer;

      const pickLayer = L.layerGroup();
      pickLayer.addTo(map);
      pickLayerRef.current = pickLayer;

      map.on("click", (e) => {
        if (!pickableRef.current || !onPickRef.current) return;
        onPickRef.current(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;

      setTimeout(() => {
        map.invalidateSize?.();
      }, 100);
    }

    init().catch(() => undefined);

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      pickLayerRef.current = null;
    };
  }, [mapId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || Number.isNaN(centerLat) || Number.isNaN(centerLng)) return;
    if (map.flyTo) {
      map.flyTo([centerLat, centerLng], zoom);
    } else {
      map.setView([centerLat, centerLng], zoom);
    }
  }, [centerLat, centerLng, zoom]);

  useEffect(() => {
    const L = window.L;
    const layer = markersLayerRef.current;
    if (!L || !layer) return;

    layer.clearLayers();
    for (const marker of markers) {
      if (Number.isNaN(marker.latitude) || Number.isNaN(marker.longitude)) continue;
      L.circleMarker([marker.latitude, marker.longitude], {
        radius: 8,
        color: marker.color ?? "#dc2626",
        fillColor: marker.color ?? "#dc2626",
        fillOpacity: 0.85,
        weight: 2,
      })
        .addTo(layer)
        .bindPopup(`<strong>${marker.name}</strong>${marker.subtitle ? `<br/>${marker.subtitle}` : ""}`);
    }
  }, [markers]);

  useEffect(() => {
    const L = window.L;
    const layer = pickLayerRef.current;
    if (!L || !layer) return;

    layer.clearLayers();
    if (pickLat === null || pickLng === null || Number.isNaN(pickLat) || Number.isNaN(pickLng)) return;

    L.circleMarker([pickLat, pickLng], {
      radius: 10,
      color: "#1d4ed8",
      fillColor: "#3b82f6",
      fillOpacity: 0.95,
      weight: 3,
    })
      .addTo(layer)
      .bindPopup(
        `<strong>${pickLabel ?? "Selected location"}</strong><br/>${pickLat.toFixed(5)}, ${pickLng.toFixed(5)}`,
      );
  }, [pickLat, pickLng, pickLabel]);

  return (
    <div
      className={`relative z-0 h-80 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${className}`}
    >
      <div id={`map-${mapId}`} className="h-full w-full" />
      {pickable && (
        <p className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
          Click the map to set location
        </p>
      )}
    </div>
  );
}
