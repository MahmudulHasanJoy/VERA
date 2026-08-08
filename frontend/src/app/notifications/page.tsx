"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";
import type { Notification } from "@/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: number) {
    const updated = await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader
          title="Notifications"
          description="Alerts for blood requests, verification updates, and relief coordination."
        />

        {loading && <p className="text-sm text-slate-500">Loading alerts...</p>}

        <div className="space-y-3">
          {!loading && notifications.length === 0 && (
            <EmptyState title="No notifications yet" description="When matching blood requests or coverage alerts arrive, they will show here." />
          )}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                n.is_read ? "border-slate-200 bg-white" : "border-red-200 bg-red-50/40"
              }`}
            >
              <div className="flex justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{n.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.is_read && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="h-fit rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium hover:bg-slate-50"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
