import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">VERA</p>
          <p className="mt-2 text-sm text-slate-600">
            Volunteer Emergency Response Alliance — connecting people in need with volunteers,
            donors, hospitals, and NGOs across Bangladesh.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Quick links</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link href="/register" className="hover:text-red-600">
                Join as volunteer or partner
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-red-600">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-red-600">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Response focus</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Emergency &amp; incident reporting</li>
            <li>Blood donor matching</li>
            <li>Shelter &amp; relief coordination</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        VERA · Community emergency coordination platform
      </div>
    </footer>
  );
}
