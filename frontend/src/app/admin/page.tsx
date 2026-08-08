"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { api, ApiError } from "@/lib/api";
import type { AdminReport } from "@/types";

export default function AdminPage() {
  const [report, setReport] = useState<AdminReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .adminReport()
      .then(setReport)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Access denied");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <PageHeader
          title="Admin Reports"
          description="Operational overview across users, emergencies, donations, and relief programs."
        />

        {loading && <p className="text-sm text-slate-500">Loading admin report...</p>}
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error} — admin role required.
          </div>
        )}

        {report && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total donations" value={report.total_donations} />
              <StatCard label="Total raised (৳)" value={Math.round(report.total_raised)} accent="bg-emerald-50 text-emerald-700" />
              <StatCard label="Active opportunities" value={report.active_opportunities} accent="bg-blue-50 text-blue-700" />
              <StatCard label="Open incidents" value={report.open_incidents} accent="bg-orange-50 text-orange-700" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Users by role</h2>
                <ul className="mt-4 space-y-2">
                  {Object.entries(report.users_by_role).map(([role, count]) => (
                    <li key={role} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <span className="capitalize text-slate-700">{role}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Emergencies by status</h2>
                <ul className="mt-4 space-y-2">
                  {Object.entries(report.emergencies_by_status).map(([status, count]) => (
                    <li key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <span className="capitalize text-slate-700">{status.replaceAll("_", " ")}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
