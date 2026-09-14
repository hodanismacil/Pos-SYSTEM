import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import api from "../api/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Dir Request-ka Login-ka Backend-ka
      const response = await api.post("/users/login", {
        email,
        password,
      });

      // 2. Ka soo qaad Token-ka iyo Role-ka Jawaabta Backend-ka
      const token = response.data.token || response.data.data?.token;
      const userRole = response.data.user?.role || response.data.data?.user?.role || "ADMIN";

      if (token) {
        // 3. Ku kaydi Token-ka iyo Role-ka LocalStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);

        // 4. U kala hagi sida ay kala leeyihiin rukhsadda (RBAC)
        if (userRole === "CASHIER") {
          navigate("/pos");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Token-ka laguma helin jawaabta server-ka.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Email ama Password khaldan, fadlan dib u fiiri."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101631] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">POS System</h1>
          <p className="mt-1 text-sm text-slate-400">Geli xogtaada si aad u gasho terminal-ka</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}