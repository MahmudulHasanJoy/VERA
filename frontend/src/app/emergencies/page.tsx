"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { EmergencyRequest, EmergencyType, User } from "@/types";

const emergencyTypes: { value: EmergencyType; label: string }[] = [
  { value: "medical", label: "Medical" },
  { value: "blood", label: "Blood" },
  { value: "ambulance", label: "Ambulance" },
  { value: "food", label: "Food" },
  { value: "shelter", label: "Shelter" },
  { value: "rescue", label: "Rescue" },
  { value: "transport", label: "Transport" },
  { value: "missing_person", label: "Missing Person" },
  { value: "other", label: "Other" },
];

export default function EmergenciesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    emergency_type: "medical" as EmergencyType,
    location: "",
    contact_phone: "",
  });

  useEffect(() => {
    Promise.all([api.me(), api.listEmergencies()])
      .then(([profile, list]) => {
        setUser(profile);
        setRequests(list);
      })
      .catch(() => setError("Could not load emergencies."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const created = await api.createEmergency(form);
      setRequests((prev) => [created, ...prev]);
      setForm({ title: "", description: "", emergency_type: "medical", location: "", contact_phone: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit request");
    }
  }

  async function verifyRequest(id: number) {
    const updated = await api.updateEmergency(id, { is_verified: true, status: "verified" });
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  const canVerify = user && ["volunteer", "ngo", "hospital", "admin"].includes(user.role);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          title="Emergency Requests"
          description="Report urgent needs and let verified responders, NGOs, and hospitals pick them up quickly."
        />

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">New request</h2>
            <p className="mt-1 text-sm text-slate-500">Share clear details so responders can act faster.</p>
            <div className="mt-4 space-y-3">
              <Field label="Title">
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={fieldClass} placeholder="Short summary" />
              </Field>
              <Field label="Type">
                <select value={form.emergency_type} onChange={(e) => setForm({ ...form, emergency_type: e.target.value as EmergencyType })} className={fieldClass}>
                  {emergencyTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <textarea required minLength={10} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fieldClass} min-h-28`} placeholder="What happened and what help is needed?" />
              </Field>
              <Field label="Location" hint="Area, landmark, or address">
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={fieldClass} placeholder="Mirpur 10, Dhaka" />
              </Field>
              <Field label="Contact phone">
                <input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className={fieldClass} placeholder="01XXXXXXXXX" />
              </Field>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button type="submit" className="mt-4 w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
              Submit request
            </button>
          </form>

          <div className="space-y-4">
            {loading && <p className="text-sm text-slate-500">Loading requests...</p>}
            {!loading && requests.length === 0 && (
              <EmptyState title="No emergency requests yet" description="Submitted requests will appear here for responders to review." />
            )}
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{request.title}</h3>
                      <StatusBadge status={request.status} />
                      {request.is_verified && <StatusBadge status="verified" />}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{request.description}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      {request.emergency_type.replaceAll("_", " ")}
                      {request.location ? ` · ${request.location}` : ""}
                      {request.contact_phone ? ` · ${request.contact_phone}` : ""}
                    </p>
                  </div>
                  {canVerify && !request.is_verified && (
                    <button type="button" onClick={() => verifyRequest(request.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                      Verify
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
