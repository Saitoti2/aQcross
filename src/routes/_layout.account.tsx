import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  MapPin,
  ShoppingBag,
  Bell,
  Tag,
  HelpCircle,
  ChevronRight,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/_layout/account")({
  component: AccountPage,
});

const menuSections = [
  {
    title: "Shopping",
    items: [
      { icon: ShoppingBag, label: "My Orders", to: "/orders", desc: "Track and manage orders" },
      { icon: Tag, label: "Student Deals", to: "/search", desc: "Exclusive offers for you" },
      { icon: Bell, label: "Notifications", to: "/notifications", desc: "Updates & alerts" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", to: "/account", desc: "Name, email, photo" },
      { icon: MapPin, label: "Saved Addresses", to: "/account", desc: "Delivery locations" },
      { icon: Shield, label: "Privacy & Security", to: "/account", desc: "Password, data" },
      { icon: Settings, label: "Preferences", to: "/account", desc: "Language, notifications" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Support", to: "/account", desc: "FAQs, contact us" },
    ],
  },
] as const;

function AccountPage() {
  // Demo user — in production this would come from an auth context
  const user = {
    name: "Alex Wanjiku",
    email: "alex.wanjiku@students.kca.ac.ke",
    institution: "KCA University, Nairobi",
    initials: "AW",
  };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-5 sm:px-6">
      {/* Profile card */}
      <div className="neu mb-6 rounded-3xl p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{user.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
              <span className="truncate">{user.institution}</span>
            </div>
          </div>
          <Link
            to="/account"
            className="neu-sm flex h-10 w-10 items-center justify-center rounded-2xl"
            aria-label="Edit profile"
          >
            <Settings className="h-4 w-4 text-brand" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Menu sections */}
      <div className="space-y-5">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h2>
            <div className="neu rounded-3xl overflow-hidden">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40 ${
                      idx > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                      <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <div>
          <div className="neu rounded-3xl overflow-hidden">
            <Link
              to="/auth/sign-in"
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-red-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <LogOut className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <p className="flex-1 text-sm font-semibold text-red-500">Sign Out</p>
              <ChevronRight className="h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
