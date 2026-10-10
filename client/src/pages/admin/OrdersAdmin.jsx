import { useEffect, useState } from "react";
import api, { errMsg, money } from "../../api";
import { statusColor } from "../Orders";

const STATUSES = Object.keys(statusColor);

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const load = () => api.get("/orders/admin/all").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try { await api.patch(`/orders/${id}/status`, { status }); load(); } catch (e) { alert(errMsg(e)); }
  };

  const shown = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <select className="input mb-4 max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All statuses</option>
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr><th className="p-3">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody className="divide-y">
            {shown.map((o) => (
              <tr key={o.id}>
                <td className="p-3">#{o.id}<br /><span className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span></td>
                <td>{o.user.name}<br /><span className="text-xs text-gray-500">{o.user.email}</span></td>
                <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td>{money(o.total)}</td>
                <td>
                  <select className={`rounded-full px-2 py-1 text-xs font-medium ${statusColor[o.status]}`}
                    value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && <p className="p-6 text-center text-gray-500">No orders.</p>}
      </div>
    </div>
  );
}
