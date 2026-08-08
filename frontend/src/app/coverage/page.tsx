"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import LocationMap from "@/components/LocationMap";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { CoverageArea, CoverageStatus } from "@/types";

const mapColors: Record<CoverageStatus, string> = {
  served: "#059669",
  partial: "#ca8a04",
  underserved: "#ea580c",
  critical: "#dc2626",
};

export default function CoveragePage() {
  const [areas, setAreas] = useState<CoverageArea[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    area_name: "",
    latitude: "23.8103",
    longitude: "90.4125",
    coverage_status: "underserved" as CoverageStatus,
    notes: "",
  });

  useEffect(() => {
    api
      .listCoverage()
      .then(setAreas)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createCoverage({
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      setAreas((prev) => [created, ...prev]);
      setForm((prev) => ({ ...prev, area_name: "", notes: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to report coverage");
    }
  }

  const markers = useMemo(
    () =>
      areas.map((area) => ({
        id: area.id,
        name: area.area_name,
        latitude: area.latitude,
        longitude: area.longitude,
        subtitle: area.coverage_status,
        color: mapColors[area.coverage_status],
      })),
    [areas],
  );

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          title="Disaster Coverage Monitoring"
          description="Track relief operations on the map and flag underserved or critical areas."
        />

        <form onSubmit={submit} className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Report area coverage</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Area name">
                <input required value={form.area_name} onChange={(e) => setForm({ ...form, area_name: e.target.value })} className={fieldClass} />
              </Field>
            </div>
            <Field label="Latitude">
              <input required value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className={fieldClass} />
            </Field>
            <Field label="Longitude">
              <input required value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className={fieldClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Status">
                <select value={form.coverage_status} onChange={(e) => setForm({ ...form, coverage_status: e.target.value as CoverageStatus })} className={fieldClass}>
                  <option value="served">Served</option>
                  <option value="partial">Partial</option>
                  <option value="underserved">Underserved</option>
                  <option value="critical">Critical</option>
                </select>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${fieldClass} min-h-20`} />
              </Field>
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button type="submit" className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Report coverage
          </button>
        </form>

        <div className="mt-8">
          <p className="mb-3 text-sm text-slate-500">
            Click the map to pick a location, or edit latitude/longitude above. Existing reports appear as colored markers.
          </p>
          <LocationMap
            center={{
              latitude: Number(form.latitude) || 23.8103,
              longitude: Number(form.longitude) || 90.4125,
            }}
            markers={markers}
            zoom={11}
            pickable
            pickMarker={{
              latitude: Number(form.latitude) || 23.8103,
              longitude: Number(form.longitude) || 90.4125,
              label: form.area_name || "Selected area",
            }}
            onLocationPick={(latitude, longitude) => {
              setForm((prev) => ({
                ...prev,
                latitude: latitude.toFixed(5),
                longitude: longitude.toFixed(5),
              }));
            }}
          />
        </div>

        {loading && <p className="mt-8 text-sm text-slate-500">Loading coverage areas...</p>}
        {!loading && areas.length === 0 && (
          <div className="mt-8">
            <EmptyState title="No coverage reports yet" description="Add underserved or critical zones so NGOs can prioritize relief." />
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <div key={area.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{area.area_name}</h3>
                <StatusBadge status={area.coverage_status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{area.notes || "No notes"}</p>
              <p className="mt-2 text-xs text-slate-500">
                {area.latitude}, {area.longitude}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
