import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Package, Tag, Truck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_layout/notifications")({
  component: NotificationsPage,
});

const notifications = [
  {
    id: "n-1",
    icon: Truck,
    title: "Your order AQ-10428 is on the way",
    body: "Brian K. is heading to KCA University — estimated 12 mins.",
    time: "5 mins ago",
    read: false,
  },
  {
    id: "n-2",
    icon: Package,
    title: "Order AQ-10391 is being prepared",
    body: "Campus Butchery is preparing your Beef Sirloin Cuts.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n-3",
    icon: Tag,
    title: "Student Deal: Kenchic Chicken 12% off",
    body: "Valid today only at Naivas. Add to cart before it expires.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n-4",
    icon: ShieldCheck,
    title: "Order AQ-10254 delivered",
    body: "Your stationery order was delivered. How was it?",
    time: "Mon, 28 Aug",
    read: true,
  },
  {
    id: "n-5",
    icon: Tag,
    title: "Pembe Maize Flour — new student price",
    body: "Now KES 189 (was 215) at Naivas Roysambu.",
    time: "Mon, 28 Aug",
    read: true,
  },
];

function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-8 pt-5 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unread.length > 0 && (
          <span className="rounded-2xl bg-brand px-3 py-1 text-xs font-semibold text-white">
            {unread.length} new
          </span>
        )}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="neu flex h-24 w-24 items-center justify-center rounded-full">
            <Bell className="h-10 w-10 text-muted-foreground/30" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold">No notifications yet</h2>
          <p className="text-sm text-muted-foreground">Order updates and deals will appear here.</p>
        </div>
      )}

      {unread.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            New
          </h2>
          <div className="space-y-3">
            {unread.map((n) => (
              <NotifCard key={n.id} n={n} />
            ))}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Earlier
          </h2>
          <div className="space-y-3">
            {read.map((n) => (
              <NotifCard key={n.id} n={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NotifCard({ n }: { n: (typeof notifications)[number] }) {
  const Icon = n.icon;
  return (
    <div
      className={`neu rounded-3xl p-4 ${!n.read ? "ring-1 ring-brand/20" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            n.read ? "bg-muted" : "bg-brand/10"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${n.read ? "text-muted-foreground" : "text-brand"}`}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${n.read ? "text-muted-foreground" : ""}`}>
            {n.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
          <p className="mt-1.5 text-xs text-muted-foreground/70">{n.time}</p>
        </div>
        {!n.read && (
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
        )}
      </div>
    </div>
  );
}
