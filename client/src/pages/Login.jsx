import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../api";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="input" type="email" placeholder="Email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn w-full">Login</button>
      <p className="text-center text-sm text-gray-500">
        No account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
      </p>
    </form>
  );
}
