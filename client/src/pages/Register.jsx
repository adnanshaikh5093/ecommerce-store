import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../api";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try { await register(form.name, form.email, form.password); navigate("/"); }
    catch (err) { setError(errMsg(err)); }
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-2xl font-bold">Create account</h1>
      <input className="input" placeholder="Name" required value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" type="email" placeholder="Email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn w-full">Register</button>
      <p className="text-center text-sm text-gray-500">
        Have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
      </p>
    </form>
  );
}
