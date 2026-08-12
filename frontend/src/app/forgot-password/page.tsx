"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { api, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setLoading(true);

    try {
      const result = await api.forgotPassword(email.trim());
      setMessage(result.message);
      if (result.reset_url) setResetUrl(result.reset_url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your account email. We will prepare a reset link (emailed when SMTP is configured).
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {resetUrl && (
            <p className="break-all rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Reset link:{" "}
              <Link href={resetUrl} className="font-medium underline">
                {resetUrl}
              </Link>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Get reset link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          <Link href="/login" className="font-medium text-red-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
