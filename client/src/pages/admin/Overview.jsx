import { useEffect, useState } from "react";
import api, { money } from "../../api";

export default function Overview() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/admin/stats").then((r) => setS(r.data)); }, []);
  if (!s) return <p className="text-gray-500">Loading...</p>;

  const cards = [
    ["Revenue", money(s.revenue)], ["Orders", s.orders], ["Products", s.products], ["Users", s.users],
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Low stock</h2>
          {s.lowStock.length === 0 ? <p className="text-sm text-gray-500">All good.</p> : (
            <ul className="divide-y text-sm">
              {s.lowStock.map((p) => <li key={p.id} className="flex justify-between py-2"><span>{p.name}</span><span className="text-red-600">{p.stock} left</span></li>)}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Recent orders</h2>
          {s.recentOrders.length === 0 ? <p className="text-sm text-gray-500">No orders yet.</p> : (
            <ul className="divide-y text-sm">
              {s.recentOrders.map((o) => <li key={o.id} className="flex justify-between py-2"><span>#{o.id} · {o.user.name}</span><span>{money(o.total)}</span></li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
