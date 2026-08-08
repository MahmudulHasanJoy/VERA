"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import { api, ApiError } from "@/lib/api";
import type { Shelter, User } from "@/types";

export default function SheltersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    capacity: "50",
    available_beds: "20",
    contact_phone: "",
  });

  useEffect(() => {
    Promise.all([api.me(), api.listShelters()])
      .then(([profile, list]) => {
        setUser(profile);
        setShelters(list);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createShelter({
        ...form,
        capacity: Number(form.capacity),
        available_beds: Number(form.available_beds),
      });
      setShelters((prev) => [created, ...prev]);
      setForm({ name: "", address: "", capacity: "50", available_beds: "20", contact_phone: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save shelter");
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <PageHeader
          title="Shelter Management"
          description="Find open emergency shelters and remaining bed capacity across affected areas."
        />

        {(user?.role === "ngo" || user?.role === "admin") && (
          <form onSubmit={submit} className="mb-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Add shelter</h2>
            <div className="mt-4 space-y-3">
              <Field label="Shelter name">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Address">
                <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Contact phone">
                <input required value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className={fieldClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Capacity">
                  <input required type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Available beds">
                  <input required type="number" value={form.available_beds} onChange={(e) => setForm({ ...form, available_beds: e.target.value })} className={fieldClass} />
                </Field>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button type="submit" className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Save shelter
            </button>
          </form>
        )}

        {loading && <p className="text-sm text-slate-500">Loading shelters...</p>}
        {!loading && shelters.length === 0 && (
          <EmptyState title="No shelters listed yet" description="NGO partners can publish shelter capacity for the community." />
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {shelters.map((s) => {
            const fill = s.capacity > 0 ? Math.round((s.available_beds / s.capacity) * 100) : 0;
            return (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.address}</p>
                <p className="mt-3 text-sm font-medium text-slate-800">
                  {s.available_beds} / {s.capacity} beds available
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(fill, 100)}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-500">{s.contact_phone}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );
}
