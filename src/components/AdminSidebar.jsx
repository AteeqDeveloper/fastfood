import {
  LayoutDashboard,
  Zap,
  Package,
  ReceiptText,
  BarChart3,
  MessageSquareText,
  Users,
  Settings,
  User,
  LogOut,
  ExternalLink,
  Flame,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
    group: "Main",
  },
  {
    id: "pos",
    label: "POS & Billing",
    icon: Zap,
    badge: "Fast",
    badgeColor: "bg-turmeric text-charcoal",
    group: "Operations",
  },
  {
    id: "products",
    label: "Products / Services",
    icon: Package,
    badge: null,
    group: "Operations",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ReceiptText,
    badgeKey: "activeOrders",
    group: "Operations",
  },
  {
    id: "analytics",
    label: "Reports / Analytics",
    icon: BarChart3,
    badge: null,
    group: "Insights",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: MessageSquareText,
    badgeKey: "pendingReviews",
    badgeColor: "bg-turmeric text-charcoal",
    group: "Insights",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    badge: null,
    group: "Management",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    badge: null,
    group: "Management",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    badge: null,
    group: "Management",
  },
];

export default function AdminSidebar({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  session,
  onSignOut,
  onBackToStorefront,
  pendingReviewsCount = 0,
  activeOrdersCount = 0,
}) {
  const dynamicBadges = {
    pendingReviews: pendingReviewsCount > 0 ? pendingReviewsCount : null,
    activeOrders: activeOrdersCount > 0 ? activeOrdersCount : null,
  };

  const navGroups = [
    { name: "Overview", items: ADMIN_NAV_ITEMS.filter((i) => i.group === "Main") },
    { name: "Store Operations", items: ADMIN_NAV_ITEMS.filter((i) => i.group === "Operations") },
    { name: "Analytics & Feedback", items: ADMIN_NAV_ITEMS.filter((i) => i.group === "Insights") },
    { name: "System", items: ADMIN_NAV_ITEMS.filter((i) => i.group === "Management") },
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          w-72 lg:w-64 xl:w-72
          bg-charcoal text-cream
          border-r border-white/10
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Header / Brand */}
        <div className="p-4 lg:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chili to-turmeric flex items-center justify-center text-white shadow-md shadow-chili/25 shrink-0">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg tracking-tight text-white truncate">
                  Flame<span className="text-chili">Bite</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-chili/20 text-chili border border-chili/30 px-1.5 py-0.2 rounded">
                  Admin Panel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-basil animate-pulse" />
              </div>
            </div>
          </div>

          {/* Close button on mobile/tablet */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg bg-charcoal-light hover:bg-white/10 text-cream/70 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scroll-thin">
          {navGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-cream/40 mb-1.5">
                {group.name}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const badgeVal = item.badgeKey
                  ? dynamicBadges[item.badgeKey]
                  : item.badge;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`
                      relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                      transition-all duration-200 group text-left
                      ${
                        isActive
                          ? "bg-chili text-white shadow-md shadow-chili/25 font-bold"
                          : "text-cream/70 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {/* Left Active Accent Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-turmeric rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "text-white bg-white/10"
                            : "text-cream/50 group-hover:text-chili group-hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Badge / Indicator */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {badgeVal && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white text-chili"
                              : item.badgeColor || "bg-chili/20 text-chili border border-chili/30"
                          }`}
                        >
                          {badgeVal}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Section: Profile, Storefront Switch & Logout */}
        <div className="p-3 border-t border-white/10 bg-charcoal-light/60 space-y-2 shrink-0">
          {/* User Profile Pill */}
          <button
            onClick={() => {
              onSelectTab("profile");
              if (onClose) onClose();
            }}
            className={`w-full p-2 rounded-xl flex items-center gap-2.5 transition-all text-left ${
              currentTab === "profile"
                ? "bg-white/10 ring-1 ring-white/20"
                : "hover:bg-white/5"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-chili/20 border border-chili/40 text-chili flex items-center justify-center font-bold text-xs shrink-0">
              {session?.user?.email ? session.user.email[0].toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-cream truncate">
                {session?.user?.email?.split("@")[0] || "Admin"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-cream/50">
                <ShieldCheck className="w-3 h-3 text-turmeric" />
                <span className="truncate">Super Admin</span>
              </div>
            </div>
          </button>

          {/* Action Buttons: Storefront & Sign Out */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={onBackToStorefront}
              className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cream/80 hover:text-white text-[11px] font-semibold transition-colors border border-white/5"
              title="Return to customer storefront"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cream/60" />
              <span>Storefront</span>
            </button>

            <button
              onClick={onSignOut}
              className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white text-[11px] font-semibold transition-all border border-red-500/20"
              title="Sign out of Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
