import { useState } from "react";
import Overview from "./Overview";
import ProductsAdmin from "./ProductsAdmin";
import OrdersAdmin from "./OrdersAdmin";

const tabs = { Overview, Products: ProductsAdmin, Orders: OrdersAdmin };

export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");
  const Tab = tabs[tab];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Admin dashboard</h1>
      <div className="mb-6 flex gap-2 border-b">
        {Object.keys(tabs).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>
      <Tab />
    </div>
  );
}
