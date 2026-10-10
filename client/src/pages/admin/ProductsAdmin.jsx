import { useEffect, useState } from "react";
import api, { errMsg, money } from "../../api";
import Pagination from "../../components/Pagination";

const empty = { name: "", description: "", price: "", image: "", category: "", stock: "" };

export default function ProductsAdmin() {
  const [data, setData] = useState({ products: [], page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null); // null = closed
  const [error, setError] = useState("");

  const load = () => api.get("/products", { params: { page, search, limit: 8 } }).then((r) => setData(r.data));
  useEffect(() => { load(); }, [page, search]);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (form.id) await api.put(`/products/${form.id}`, form);
      else await api.post("/products", form);
      setForm(null);
      load();
    } catch (err) { setError(errMsg(err)); }
  };

  const del = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try { await api.delete(`/products/${p.id}`); load(); } catch (err) { alert(errMsg(err)); }
  };

  const field = (key, label, type = "text") => (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input className="input" type={type} step={type === "number" ? "0.01" : undefined}
        required={key !== "image"} value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <input className="input max-w-xs" placeholder="Search products..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <button className="btn" onClick={() => setForm(empty)}>+ New product</button>
      </div>

      {form && (
        <form onSubmit={save} className="card mb-6 grid gap-4 p-5 md:grid-cols-2">
          <h2 className="font-semibold md:col-span-2">{form.id ? "Edit product" : "New product"}</h2>
          {field("name", "Name")}
          {field("category", "Category")}
          {field("price", "Price", "number")}
          {field("stock", "Stock", "number")}
          <div className="md:col-span-2">{field("image", "Image URL")}</div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea className="input" rows="3" required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
          <div className="flex gap-2 md:col-span-2">
            <button className="btn">Save</button>
            <button type="button" className="btn-outline" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr><th className="p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody className="divide-y">
            {data.products.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-medium">{p.name}</td>
                <td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td>
                <td className="space-x-2 p-3 text-right">
                  <button className="btn-outline" onClick={() => setForm(p)}>Edit</button>
                  <button className="btn-danger" onClick={() => del(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
