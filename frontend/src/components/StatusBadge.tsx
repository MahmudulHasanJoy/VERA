const STATUS_STYLES: Record<string, string> = {
  open: "bg-orange-50 text-orange-700",
  in_progress: "bg-blue-50 text-blue-700",
  verified: "bg-emerald-50 text-emerald-700",
  resolved: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-yellow-50 text-yellow-700",
  completed: "bg-slate-100 text-slate-700",
  accepted: "bg-blue-50 text-blue-700",
  closed: "bg-slate-100 text-slate-600",
  served: "bg-emerald-50 text-emerald-700",
  partial: "bg-yellow-50 text-yellow-700",
  underserved: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
  urgent: "bg-red-50 text-red-700",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${style}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
