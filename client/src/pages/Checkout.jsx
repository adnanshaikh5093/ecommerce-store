import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg, money } from "../api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, refresh } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await api.post("/orders", { address });
      await refresh();
      navigate("/orders");
    } catch (err) {
      setError(errMsg(err));
    } finally { setBusy(false); }
  };

  if (!items.length) return <p className="py-20 text-center text-gray-500">Your cart is empty.</p>;

  return (
    <form onSubmit={submit} className="card mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div>
        <label className="mb-1 block text-sm font-medium">Shipping address</label>
        <textarea className="input" rows="3" required value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <ul className="divide-y text-sm">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between py-2">
            <span>{i.product.name} × {i.quantity}</span><span>{money(i.quantity * i.product.price)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
      <p className="text-xs text-gray-500">Demo store: no real payment is processed.</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn w-full" disabled={busy}>{busy ? "Placing order..." : "Place order"}</button>
    </form>
  );
}
