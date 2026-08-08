"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { Coordination, Resource, User } from "@/types";

export default function ResourcesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [coordination, setCoordination] = useState<Coordination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resourceForm, setResourceForm] = useState({
    name: "",
    resource_type: "food",
    quantity: "10",
    location: "",
  });
  const [coordForm, setCoordForm] = useState({
    title: "",
    message: "",
    volunteers_needed: "5",
    location: "",
  });

  useEffect(() => {
    Promise.all([api.me(), api.listResources(), api.listCoordination()])
      .then(([profile, resourceList, coordList]) => {
        setUser(profile);
        setResources(resourceList);
        setCoordination(coordList);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submitResource(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createResource({
        ...resourceForm,
        quantity: Number(resourceForm.quantity),
      });
      setResources((prev) => [created, ...prev]);
      setResourceForm({ name: "", resource_type: "food", quantity: "10", location: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add resource");
    }
  }

  async function submitCoordination(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createCoordination({
        ...coordForm,
        volunteers_needed: Number(coordForm.volunteers_needed),
      });
      setCoordination((prev) => [created, ...prev]);
      setCoordForm({ title: "", message: "", volunteers_needed: "5", location: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send request");
    }
  }

  const canManage = user && ["ngo", "hospital", "admin"].includes(user.role);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <PageHeader
          title="Resources & NGO Coordination"
          description="Track relief stock and request multi-organization support without creating new channels."
        />
        {error && <p className="text-sm text-red-600">{error}</p>}

        {canManage && (
          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={submitResource} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Track resource</h2>
              <div className="mt-4 space-y-3">
                <Field label="Resource name">
                  <input required value={resourceForm.name} onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Type">
                  <select value={resourceForm.resource_type} onChange={(e) => setResourceForm({ ...resourceForm, resource_type: e.target.value })} className={fieldClass}>
                    <option value="food">Food</option>
                    <option value="medicine">Medicine</option>
                    <option value="clothing">Clothing</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </Field>
                <Field label="Quantity">
                  <input required type="number" value={resourceForm.quantity} onChange={(e) => setResourceForm({ ...resourceForm, quantity: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Location">
                  <input value={resourceForm.location} onChange={(e) => setResourceForm({ ...resourceForm, location: e.target.value })} className={fieldClass} placeholder="Warehouse / area" />
                </Field>
              </div>
              <button type="submit" className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Add resource
              </button>
            </form>

            <form onSubmit={submitCoordination} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Request NGO support</h2>
              <div className="mt-4 space-y-3">
                <Field label="Title">
                  <input required value={coordForm.title} onChange={(e) => setCoordForm({ ...coordForm, title: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Message">
                  <textarea required value={coordForm.message} onChange={(e) => setCoordForm({ ...coordForm, message: e.target.value })} className={`${fieldClass} min-h-24`} />
                </Field>
                <Field label="Volunteers needed">
                  <input type="number" value={coordForm.volunteers_needed} onChange={(e) => setCoordForm({ ...coordForm, volunteers_needed: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Location">
                  <input value={coordForm.location} onChange={(e) => setCoordForm({ ...coordForm, location: e.target.value })} className={fieldClass} />
                </Field>
              </div>
              <button type="submit" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Send request
              </button>
            </form>
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Available resources</h2>
          {loading && <p className="mt-3 text-sm text-slate-500">Loading...</p>}
          {!loading && resources.length === 0 && (
            <div className="mt-4">
              <EmptyState title="No resources tracked yet" description="NGOs and hospitals can publish relief inventory here." />
            </div>
          )}
          <div className="mt-4 space-y-3">
            {resources.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-900">{r.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {r.resource_type} · {r.quantity} {r.unit}
                  {r.location ? ` · ${r.location}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Coordination requests</h2>
          {!loading && coordination.length === 0 && (
            <div className="mt-4">
              <EmptyState title="No coordination requests" description="Support requests between organizations will appear here." />
            </div>
          )}
          <div className="mt-4 space-y-3">
            {coordination.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{c.message}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {c.volunteers_needed} volunteers needed
                  {c.location ? ` · ${c.location}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
