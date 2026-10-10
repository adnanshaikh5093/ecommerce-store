import { useEffect, useState } from "react";
import api, { money } from "../api";

export const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api.get("/orders").then((r) => setOrders(r.data)); }, []);

  if (!orders) return <p className="py-20 text-center text-gray-500">Loading...</p>;
  if (!orders.length) return <p className="py-20 text-center text-gray-500">You haven't placed any orders yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      {orders.map((o) => (
        <div key={o.id} className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">Order #{o.id}</p>
              <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
          </div>
          <ul className="mt-3 divide-y text-sm">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between py-2">
                <span>{i.product.name} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-right font-bold">Total: {money(o.total)}</p>
        </div>
      ))}
    </div>
  );
}
