import { useState } from "react";
import { Users, UserPlus, Shield, Check, Clock, Search, MoreVertical, Mail, Phone, ShieldCheck } from "lucide-react";

const INITIAL_STAFF = [
  {
    id: "usr_1",
    name: "Alex Martinez",
    email: "alex.admin@crispybites.com",
    role: "Super Admin",
    status: "Active",
    lastActive: "Just now",
    avatarColor: "bg-chili",
  },
  {
    id: "usr_2",
    name: "Sarah Chen",
    email: "sarah.pos@crispybites.com",
    role: "Cashier / POS",
    status: "Active",
    lastActive: "15 mins ago",
    avatarColor: "bg-turmeric",
  },
  {
    id: "usr_3",
    name: "Tariq Mahmood",
    email: "tariq.kitchen@crispybites.com",
    role: "Kitchen Head",
    status: "Active",
    lastActive: "1 hour ago",
    avatarColor: "bg-basil",
  },
  {
    id: "usr_4",
    name: "Hassan Ali",
    email: "hassan.delivery@crispybites.com",
    role: "Delivery Lead",
    status: "Offline",
    lastActive: "Yesterday",
    avatarColor: "bg-blue-600",
  },
];

export default function AdminUsers({ session }) {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const filteredStaff = staffList.filter((staff) => {
    const matchSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === "All" || staff.role.includes(selectedRole);
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-ink">Users &amp; Staff Management</h2>
          <p className="text-xs sm:text-sm text-ink/50 mt-0.5">
            Manage admin credentials, cashier permissions, kitchen access, and store staff roles.
          </p>
        </div>
        <button
          onClick={() => alert("Invite link copied! Send to staff member to invite them.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chili text-white font-bold text-xs shadow-md shadow-chili/25 hover:bg-chili-dark transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-ink/5 shadow-sm">
          <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Total Staff</p>
          <p className="font-display font-extrabold text-2xl text-ink mt-1">{staffList.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-ink/5 shadow-sm">
          <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Active Today</p>
          <p className="font-display font-extrabold text-2xl text-basil mt-1">3 Online</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-ink/5 shadow-sm">
          <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Current Admin</p>
          <p className="font-display font-bold text-xs text-chili mt-2 truncate">
            {session?.user?.email || "admin@crispybites.com"}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-cream/70 rounded-xl text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-chili"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Admin", "Cashier", "Kitchen", "Delivery"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedRole === role
                    ? "bg-charcoal text-white shadow-sm"
                    : "bg-cream text-ink/70 hover:bg-cream/90"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink/5 text-ink/40 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 font-medium text-ink">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-cream/30 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${staff.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                      >
                        {staff.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{staff.name}</p>
                        <p className="text-[11px] text-ink/50 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-ink/30" />
                          <span>{staff.email}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream font-semibold text-ink text-[11px] border border-ink/5">
                      <ShieldCheck className="w-3 h-3 text-chili" />
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        staff.status === "Active"
                          ? "bg-basil/15 text-basil"
                          : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          staff.status === "Active" ? "bg-basil animate-pulse" : "bg-ink/40"
                        }`}
                      />
                      {staff.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-ink/50 text-[11px]">{staff.lastActive}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => alert(`Settings for ${staff.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-cream hover:bg-turmeric/20 text-ink text-xs font-semibold transition-colors"
                    >
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
