"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import Field, { fieldClass } from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, ApiError } from "@/lib/api";
import type { Campaign, Donation, User } from "@/types";

export default function DonationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationForm, setDonationForm] = useState({
    donation_type: "money",
    amount: "1000",
    item_description: "",
    campaign_id: "",
  });
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    description: "",
    cause: "",
    goal_amount: "50000",
  });

  useEffect(() => {
    Promise.all([api.me(), api.listDonations(), api.listCampaigns()])
      .then(([profile, donationList, campaignList]) => {
        setUser(profile);
        setDonations(donationList);
        setCampaigns(campaignList);
      })
      .finally(() => setLoading(false));
  }, []);

  async function submitDonation(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createDonation({
        donation_type: donationForm.donation_type,
        amount: Number(donationForm.amount),
        item_description: donationForm.item_description || undefined,
        campaign_id: donationForm.campaign_id ? Number(donationForm.campaign_id) : undefined,
      });
      setDonations((prev) => [created, ...prev]);
      setCampaigns(await api.listCampaigns());
      setDonationForm({ donation_type: "money", amount: "1000", item_description: "", campaign_id: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Donation failed");
    }
  }

  async function submitCampaign(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createCampaign({
        title: campaignForm.title,
        description: campaignForm.description,
        cause: campaignForm.cause,
        goal_amount: Number(campaignForm.goal_amount),
      });
      setCampaigns((prev) => [created, ...prev]);
      setCampaignForm({ title: "", description: "", cause: "", goal_amount: "50000" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Campaign create failed");
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <PageHeader
          title="Donations & Fundraising"
          description="Contribute money or in-kind support and follow transparent campaign progress."
        />
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={submitDonation} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Make a donation</h2>
            <div className="mt-4 space-y-3">
              <Field label="Donation type">
                <select value={donationForm.donation_type} onChange={(e) => setDonationForm({ ...donationForm, donation_type: e.target.value })} className={fieldClass}>
                  <option value="money">Money</option>
                  <option value="food">Food</option>
                  <option value="medicine">Medicine</option>
                  <option value="clothing">Clothing</option>
                </select>
              </Field>
              <Field label="Amount (BDT)" hint="For money donations">
                <input type="number" value={donationForm.amount} onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Item description" hint="Optional for food, medicine, clothing">
                <input value={donationForm.item_description} onChange={(e) => setDonationForm({ ...donationForm, item_description: e.target.value })} className={fieldClass} placeholder="e.g. 20 kg rice" />
              </Field>
              <Field label="Campaign">
                <select value={donationForm.campaign_id} onChange={(e) => setDonationForm({ ...donationForm, campaign_id: e.target.value })} className={fieldClass}>
                  <option value="">General donation</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </Field>
            </div>
            <button type="submit" className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Donate
            </button>
          </form>

          {(user?.role === "ngo" || user?.role === "admin") && (
            <form onSubmit={submitCampaign} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Create fundraising campaign</h2>
              <div className="mt-4 space-y-3">
                <Field label="Title">
                  <input required value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Cause">
                  <input required value={campaignForm.cause} onChange={(e) => setCampaignForm({ ...campaignForm, cause: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Description">
                  <textarea required value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })} className={`${fieldClass} min-h-24`} />
                </Field>
                <Field label="Goal amount (BDT)">
                  <input required type="number" value={campaignForm.goal_amount} onChange={(e) => setCampaignForm({ ...campaignForm, goal_amount: e.target.value })} className={fieldClass} />
                </Field>
              </div>
              <button type="submit" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Create campaign
              </button>
            </form>
          )}
        </div>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Active campaigns</h2>
          {loading && <p className="mt-3 text-sm text-slate-500">Loading...</p>}
          {!loading && campaigns.length === 0 && (
            <div className="mt-4">
              <EmptyState title="No campaigns yet" description="NGOs can launch fundraising drives for relief." />
            </div>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => {
              const pct = c.goal_amount > 0 ? Math.min(100, Math.round((c.raised_amount / c.goal_amount) * 100)) : 0;
              return (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-slate-900">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{c.description}</p>
                  <p className="mt-3 text-sm font-semibold text-red-600">
                    ৳{c.raised_amount.toLocaleString()} / ৳{c.goal_amount.toLocaleString()}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{c.cause} · {pct}% funded</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Your donations</h2>
          {!loading && donations.length === 0 && (
            <div className="mt-4">
              <EmptyState title="No donations recorded yet" description="Your contributions will be listed here for transparency." />
            </div>
          )}
          <div className="mt-4 space-y-3">
            {donations.map((d) => (
              <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                <p className="font-medium capitalize text-slate-900">{d.donation_type}</p>
                <p className="mt-1 text-slate-600">
                  {d.amount != null ? `৳${d.amount.toLocaleString()}` : "In-kind"}
                  {d.item_description ? ` · ${d.item_description}` : ""}
                  {d.allocated_to ? ` → ${d.allocated_to}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
