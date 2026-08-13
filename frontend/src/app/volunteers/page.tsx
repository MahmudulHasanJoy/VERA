"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { BloodGroup, Certificate, Opportunity, User } from "@/types";

const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function VolunteersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [docForm, setDocForm] = useState({ id_document_type: "nid", id_document_number: "" });
  const [certForm, setCertForm] = useState({ volunteer_id: "", program_name: "" });
  const [oppForm, setOppForm] = useState({
    title: "",
    description: "",
    location: "",
    slots: "5",
    start_date: "",
    end_date: "",
  });
  const [donorGroup, setDonorGroup] = useState<BloodGroup>("O+");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const canManageOps = user?.role === "ngo" || user?.role === "admin";

  useEffect(() => {
    Promise.all([api.me(), api.listOpportunities(), api.listCertificates()])
      .then(([profile, ops, certs]) => {
        setUser(profile);
        setOpportunities(ops);
        setCertificates(certs);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submitVerification(e: FormEvent) {
    e.preventDefault();
    try {
      const updated = await api.submitVerification(docForm);
      setUser(updated);
      setMessage("Verification submitted for review.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Failed");
    }
  }

  async function apply(id: number) {
    await api.applyOpportunity(id);
    setMessage("Application submitted.");
  }

  async function createOpportunity(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createOpportunity({
        title: oppForm.title,
        description: oppForm.description,
        location: oppForm.location,
        slots: Number(oppForm.slots),
        start_date: oppForm.start_date || null,
        end_date: oppForm.end_date || null,
      });
      setOpportunities((prev) => [created, ...prev]);
      setOppForm({ title: "", description: "", location: "", slots: "5", start_date: "", end_date: "" });
      setMessage("Opportunity published.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to publish opportunity");
    }
  }

  async function issueCertificate(e: FormEvent) {
    e.preventDefault();
    const cert = await api.issueCertificate({
      volunteer_id: Number(certForm.volunteer_id),
      program_name: certForm.program_name,
    });
    setCertificates((prev) => [cert, ...prev]);
    setMessage("Certificate issued.");
  }

  async function verifyCert() {
    try {
      setVerifiedCert(await api.verifyCertificate(verifyCode));
    } catch {
      setVerifiedCert(null);
      setMessage("Certificate code not found.");
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <PageHeader
          title="Volunteers"
          description="Complete verification, apply to opportunities, and manage participation certificates."
        />
        {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {user?.role === "volunteer" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Volunteer verification</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              Status: <StatusBadge status={user.verification_status} />
              {user.is_verified && <StatusBadge status="verified" />}
            </div>
            <form onSubmit={submitVerification} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Document type">
                <select value={docForm.id_document_type} onChange={(e) => setDocForm({ ...docForm, id_document_type: e.target.value })} className={fieldClass}>
                  <option value="nid">NID</option>
                  <option value="passport">Passport</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Document number">
                <input required value={docForm.id_document_number} onChange={(e) => setDocForm({ ...docForm, id_document_number: e.target.value })} className={fieldClass} />
              </Field>
              <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:col-span-2 sm:w-fit">
                Submit for review
              </button>
            </form>
          </section>
        )}

        {(user?.role === "citizen" || user?.role === "donor") && !user.available_for_donation && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Become a blood donor</h2>
            <p className="mt-1 text-sm text-slate-500">Choose your blood group and start receiving matched request alerts.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <select value={donorGroup} onChange={(e) => setDonorGroup(e.target.value as BloodGroup)} className={`${fieldClass} max-w-xs`}>
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  api
                    .becomeDonor({ blood_group: donorGroup, available_for_donation: true })
                    .then((profile) => {
                      setUser(profile);
                      setMessage(`Registered as ${donorGroup} donor — blood alerts are on.`);
                    })
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Register as donor
              </button>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Volunteer opportunities</h2>
          <p className="mt-1 text-sm text-slate-500">
            {canManageOps
              ? "Publish open programs for volunteers to apply to."
              : "Browse open programs posted by NGOs and admins."}
          </p>

          {canManageOps && (
            <form onSubmit={createOpportunity} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <input
                  required
                  value={oppForm.title}
                  onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                  className={fieldClass}
                  placeholder="Flood relief team — Sylhet"
                />
              </Field>
              <Field label="Location">
                <input
                  required
                  value={oppForm.location}
                  onChange={(e) => setOppForm({ ...oppForm, location: e.target.value })}
                  className={fieldClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea
                    required
                    value={oppForm.description}
                    onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
                    className={`${fieldClass} min-h-24`}
                  />
                </Field>
              </div>
              <Field label="Slots">
                <input
                  required
                  type="number"
                  min={1}
                  value={oppForm.slots}
                  onChange={(e) => setOppForm({ ...oppForm, slots: e.target.value })}
                  className={fieldClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date">
                  <input
                    type="date"
                    value={oppForm.start_date}
                    onChange={(e) => setOppForm({ ...oppForm, start_date: e.target.value })}
                    className={fieldClass}
                  />
                </Field>
                <Field label="End date">
                  <input
                    type="date"
                    value={oppForm.end_date}
                    onChange={(e) => setOppForm({ ...oppForm, end_date: e.target.value })}
                    className={fieldClass}
                  />
                </Field>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:col-span-2 sm:w-fit"
              >
                Publish opportunity
              </button>
            </form>
          )}

          {loading && <p className="mt-3 text-sm text-slate-500">Loading...</p>}
          {!loading && opportunities.length === 0 && (
            <div className="mt-4">
              <EmptyState
                title="No opportunities posted"
                description={
                  canManageOps
                    ? "Use the form above to publish the first volunteer program."
                    : "NGOs and admins can publish open volunteer programs here."
                }
              />
            </div>
          )}
          <div className="mt-4 space-y-3">
            {opportunities.map((o) => (
              <div key={o.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-900">{o.title}</h3>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{o.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {o.location} · {o.filled_slots}/{o.slots} slots filled
                  {o.start_date ? ` · ${o.start_date}` : ""}
                  {o.end_date ? ` → ${o.end_date}` : ""}
                </p>
                {user?.role === "volunteer" && o.status === "open" && (
                  <button type="button" onClick={() => apply(o.id)} className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                    Apply
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Certificates</h2>
          {!loading && certificates.length === 0 && (
            <div className="mt-4">
              <EmptyState title="No certificates yet" description="Issued certificates will appear with verification codes." />
            </div>
          )}
          <div className="mt-3 space-y-2">
            {certificates.map((c) => (
              <div key={c.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-900">{c.program_name}</p>
                <p className="text-slate-600">{c.certificate_code}</p>
              </div>
            ))}
          </div>
          {(user?.role === "ngo" || user?.role === "admin") && (
            <form onSubmit={issueCertificate} className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Volunteer ID">
                <input required value={certForm.volunteer_id} onChange={(e) => setCertForm({ ...certForm, volunteer_id: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Program name">
                <input required value={certForm.program_name} onChange={(e) => setCertForm({ ...certForm, program_name: e.target.value })} className={fieldClass} />
              </Field>
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 sm:w-fit">
                Issue certificate
              </button>
            </form>
          )}
          <div className="mt-4">
            <Field label="Verify certificate code">
              <div className="flex gap-2">
                <input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} className={fieldClass} placeholder="Enter code" />
                <button type="button" onClick={verifyCert} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                  Verify
                </button>
              </div>
            </Field>
            {verifiedCert && (
              <p className="mt-2 text-sm text-emerald-700">Valid certificate: {verifiedCert.program_name}</p>
            )}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
