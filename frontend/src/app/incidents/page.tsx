"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { Incident } from "@/types";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    disaster_type: "flood",
    severity: "high",
    location: "",
  });

  useEffect(() => {
    api
      .listIncidents()
      .then(setIncidents)
      .catch(() => setError("Could not load incidents."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createIncident(form);
      setIncidents((prev) => [created, ...prev]);
      setForm({ title: "", description: "", disaster_type: "flood", severity: "high", location: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit report");
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          title="Incident Reporting"
          description="Report floods, fires, cyclones, and other disaster situations so responders can prioritize support."
        />

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Report incident</h2>
            <div className="mt-4 space-y-3">
              <Field label="Title">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Disaster type">
                <select value={form.disaster_type} onChange={(e) => setForm({ ...form, disaster_type: e.target.value })} className={fieldClass}>
                  <option value="flood">Flood</option>
                  <option value="cyclone">Cyclone</option>
                  <option value="fire">Fire</option>
                  <option value="earthquake">Earthquake</option>
                </select>
              </Field>
              <Field label="Severity">
                <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className={fieldClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Field>
              <Field label="Description">
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fieldClass} min-h-24`} />
              </Field>
              <Field label="Location">
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={fieldClass} />
              </Field>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button type="submit" className="mt-4 w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
              Submit report
            </button>
          </form>

          <div className="space-y-4">
            {loading && <p className="text-sm text-slate-500">Loading incidents...</p>}
            {!loading && incidents.length === 0 && (
              <EmptyState title="No incidents reported" description="Community reports will show up here for monitoring." />
            )}
            {incidents.map((i) => (
              <article key={i.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{i.title}</h3>
                  <StatusBadge status={i.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{i.description}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {i.disaster_type} · severity {i.severity} · {i.location}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
