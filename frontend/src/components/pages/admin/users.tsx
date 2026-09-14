import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Edit2, Trash2, X, ShieldAlert, CheckCircle2 } from "lucide-react";

const API_URL = "http://localhost:5000/api/users";

type Role = "ADMIN" | "CASHIER" | "USER";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("accessToken");
  };

  const getConfig = () => {
    const token = getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(API_URL, getConfig());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "USER" });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.name.trim()) return setError("Name is required");
      if (!form.email.trim()) return setError("Email is required");

      if (editingUser) {
        await axios.put(
          `${API_URL}/${editingUser.id}`,
          { name: form.name, email: form.email, role: form.role },
          getConfig()
        );
        setSuccess("User updated successfully");
      } else {
        if (!form.password) return setError("Password is required");
        if (form.password.length < 6) return setError("Password must be at least 6 characters");

        await axios.post(
          API_URL,
          { name: form.name, email: form.email, password: form.password, role: form.role },
          getConfig()
        );
        setSuccess("User created successfully");
      }

      await fetchUsers();
      setTimeout(() => {
        setShowModal(false);
        setEditingUser(null);
        setSuccess("");
      }, 700);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setError("");
      setSuccess("");
      await axios.delete(`${API_URL}/${id}`, getConfig());
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setSuccess("User deleted successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  const roleStyle = (role: Role) => {
    if (role === "ADMIN") return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    if (role === "CASHIER") return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  };

  return (
    <div className="min-h-screen bg-[#080d24] text-slate-100 p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Users & Roles</h1>
          <p className="text-slate-400 text-sm mt-1">Manage system access, create cashiers and administrators.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-600/20 transition"
        >
          <Plus size={18} />
          Add New User
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm">
          <ShieldAlert size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition"
        />
      </div>

      {/* TABLE */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading user database...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 text-slate-500">#{user.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Enter email"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="USER">USER</option>
                  <option value="CASHIER">CASHIER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingUser ? "Update User" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;