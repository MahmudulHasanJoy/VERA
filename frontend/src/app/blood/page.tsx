"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { BloodDonor, BloodGroup, BloodRequest } from "@/types";

const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [searchGroup, setSearchGroup] = useState<BloodGroup>("O+");
  const [form, setForm] = useState({
    patient_name: "",
    blood_group: "O+" as BloodGroup,
    units_needed: 1,
    hospital_name: "",
    location: "",
    contact_phone: "",
    notes: "",
    is_urgent: true,
  });

  useEffect(() => {
    api
      .listBloodRequests()
      .then(setRequests)
      .finally(() => setListLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const created = await api.createBloodRequest(form);
      setRequests((prev) => [created, ...prev]);
      setForm({
        patient_name: "",
        blood_group: "O+",
        units_needed: 1,
        hospital_name: "",
        location: "",
        contact_phone: "",
        notes: "",
        is_urgent: true,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create request");
    } finally {
      setLoading(false);
    }
  }

  async function markResolved(id: number) {
    const updated = await api.updateBloodRequest(id, "resolved");
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  async function searchDonors() {
    setDonors(await api.findDonors(searchGroup));
    setSearched(true);
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          title="Blood Requests"
          description="Create urgent blood requests, notify matching donors, and search available donors by group."
        />

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">New blood request</h2>
              <div className="mt-4 space-y-3">
                <Field label="Patient name">
                  <input required value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Blood group">
                  <select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value as BloodGroup })} className={fieldClass}>
                    {bloodGroups.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Units needed">
                  <input required type="number" min={1} value={form.units_needed} onChange={(e) => setForm({ ...form, units_needed: Number(e.target.value) })} className={fieldClass} />
                </Field>
                <Field label="Contact phone">
                  <input required value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className={fieldClass} placeholder="01XXXXXXXXX" />
                </Field>
                <Field label="Hospital">
                  <input value={form.hospital_name} onChange={(e) => setForm({ ...form, hospital_name: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Location">
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Notes">
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${fieldClass} min-h-20`} placeholder="Surgery time, ward, or other details" />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.is_urgent} onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })} />
                  Mark as urgent
                </label>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="mt-4 w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {loading ? "Submitting..." : "Submit request"}
              </button>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Blood donor search</h2>
              <p className="mt-1 text-sm text-slate-500">Find available donors by blood group.</p>
              <div className="mt-3 flex gap-2">
                <select value={searchGroup} onChange={(e) => setSearchGroup(e.target.value as BloodGroup)} className={fieldClass}>
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <button type="button" onClick={searchDonors} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
                  Search
                </button>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {donors.map((d) => (
                  <li key={d.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{d.full_name}</p>
                    <p className="text-slate-600">{d.blood_group} · {d.phone ?? "No phone"}{d.address ? ` · ${d.address}` : ""}</p>
                  </li>
                ))}
              </ul>
              {searched && donors.length === 0 && (
                <p className="mt-3 text-sm text-slate-500">No available donors found for {searchGroup}.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {listLoading && <p className="text-sm text-slate-500">Loading blood requests...</p>}
            {!listLoading && requests.length === 0 && (
              <EmptyState title="No blood requests yet" description="New requests will notify matching donors automatically." />
            )}
            {requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {request.patient_name} · {request.blood_group}
                      </h3>
                      <StatusBadge status={request.status} />
                      {request.is_urgent && <StatusBadge status="urgent" />}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {request.units_needed} unit(s)
                      {request.hospital_name ? ` · ${request.hospital_name}` : ""}
                      {request.location ? ` · ${request.location}` : ""}
                    </p>
                    {request.notes && <p className="mt-2 text-sm text-slate-500">{request.notes}</p>}
                    <p className="mt-2 text-xs text-slate-500">{request.contact_phone}</p>
                  </div>
                  {request.status === "open" && (
                    <button type="button" onClick={() => markResolved(request.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                      Mark resolved
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
