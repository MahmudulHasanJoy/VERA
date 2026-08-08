"use client";

import { useMemo, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import LocationMap from "@/components/LocationMap";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { NearbyResult } from "@/types";

const markerColors: Record<string, string> = {
  shelter: "#2563eb",
  resource: "#16a34a",
  emergency: "#dc2626",
  user: "#9333ea",
};

export default function SearchPage() {
  const [latitude, setLatitude] = useState("23.8103");
  const [longitude, setLongitude] = useState("90.4125");
  const [searchType, setSearchType] = useState("");
  const [results, setResults] = useState<NearbyResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search() {
    setError("");
    setLoading(true);
    try {
      setResults(
        await api.searchNearby(Number(latitude), Number(longitude), searchType || undefined),
      );
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(String(pos.coords.latitude));
      setLongitude(String(pos.coords.longitude));
    });
  }

  const markers = useMemo(
    () =>
      results
        .filter((r) => r.latitude != null && r.longitude != null)
        .map((r) => ({
          id: `${r.type}-${r.id}`,
          name: r.name,
          latitude: r.latitude as number,
          longitude: r.longitude as number,
          subtitle: `${r.type}${r.role ? ` · ${r.role}` : ""}${r.distance_km != null ? ` · ${r.distance_km} km` : ""}`,
          color: markerColors[r.type] ?? "#dc2626",
        })),
    [results],
  );

  return (
    <AuthGuard>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <PageHeader
          title="Location-Based Search"
          description="Find nearby volunteers, hospitals, NGOs, donors, shelters, and resources around a point on the map."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Latitude">
              <input value={latitude} onChange={(e) => setLatitude(e.target.value)} className={fieldClass} />
            </Field>
            <Field label="Longitude">
              <input value={longitude} onChange={(e) => setLongitude(e.target.value)} className={fieldClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Search type">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={fieldClass}>
                  <option value="">All types</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="hospital">Hospitals</option>
                  <option value="ngo">NGOs</option>
                  <option value="donor">Donors</option>
                  <option value="shelter">Shelters</option>
                  <option value="resource">Resources</option>
                  <option value="emergency">Emergencies</option>
                </select>
              </Field>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={search} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              {loading ? "Searching..." : "Search"}
            </button>
            <button type="button" onClick={useMyLocation} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              Use my location
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm text-slate-500">
            Click the map to move the search center, or use your current location.
          </p>
          <LocationMap
            center={{ latitude: Number(latitude) || 23.8103, longitude: Number(longitude) || 90.4125 }}
            markers={markers}
            pickable
            pickMarker={{
              latitude: Number(latitude) || 23.8103,
              longitude: Number(longitude) || 90.4125,
              label: "Search center",
            }}
            onLocationPick={(lat, lng) => {
              setLatitude(lat.toFixed(5));
              setLongitude(lng.toFixed(5));
            }}
          />
        </div>

        <div className="mt-8 space-y-3">
          {searched && results.length === 0 && (
            <EmptyState title="No nearby matches" description="Try a wider radius type filter or different coordinates." />
          )}
          {results.map((r) => (
            <div key={`${r.type}-${r.id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{r.name}</h3>
                  <p className="text-sm text-slate-600">
                    {r.type} {r.role ? `· ${r.role}` : ""} · {r.location}
                  </p>
                </div>
                {r.distance_km != null && (
                  <span className="text-sm font-medium text-red-600">{r.distance_km} km</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
