import Link from "next/link";
import AvatarPicker from "../components/AvatarPicker";
import ProfileName from "../components/ProfileName";
import AccountProfiles from "../components/AccountProfiles";

const PLAN = {
  name: "Nova (With Ads)",
  price: "$9.99/mo",
  renews: "July 30, 2026",
};

const SETTINGS = [
  { label: "Account", value: "landyn.curley@students.maestrocollege.edu" },
  { label: "Password", value: "••••••••••" },
  { label: "Subscription", value: `${PLAN.name} — ${PLAN.price}` },
  { label: "Payment", value: "Visa ending in 4242" },
  { label: "Privacy & Sharing", value: "Manage" },
  { label: "Notifications", value: "On" },
];

export default function AccountPage() {
  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-10">
        <AvatarPicker size="lg" />
        <div className="min-w-0">
          <ProfileName className="block text-2xl md:text-3xl font-black truncate" />
          <p className="text-nova-gray text-xs sm:text-sm truncate">landyn.curley@students.maestrocollege.edu</p>
        </div>
        <button className="ml-auto shrink-0 text-sm font-semibold text-white/80 hover:text-nova-pink border border-white/20 rounded-full px-4 sm:px-5 py-2">
          Log Out
        </button>
      </div>

      {/* Plan card */}
      <div className="rounded-xl border border-nova-pink/30 bg-gradient-to-br from-nova-panel to-nova-dark p-6 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-nova-pink font-bold text-sm uppercase tracking-wide">Your Plan</p>
            <p className="text-2xl font-black mt-1">{PLAN.name}</p>
            <p className="text-nova-gray text-sm mt-1">
              {PLAN.price} · Renews {PLAN.renews}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-nova-pink hover:bg-white text-nova-dark font-bold px-6 py-2.5 rounded-full transition-colors">
              Manage Plan
            </button>
            <button className="bg-white/15 hover:bg-white/25 font-bold px-6 py-2.5 rounded-full transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Profiles management */}
      <AccountProfiles />

      {/* Settings list */}
      <h2 className="text-xl font-bold mb-4">Account Settings</h2>
      <div className="divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
        {SETTINGS.map((s) => (
          <div key={s.label} className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition">
            <span className="font-semibold">{s.label}</span>
            <span className="text-nova-gray text-sm text-right">{s.value}</span>
          </div>
        ))}
      </div>

      <p className="text-white/30 text-xs mt-8">
        Demo account page — not a real subscription. See your{" "}
        <Link href="/" className="text-nova-pink underline">
          home feed
        </Link>
        .
      </p>
    </div>
  );
}
