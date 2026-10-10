import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], total: 0, page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(params.get("search") || "");

  const get = (k, d = "") => params.get(k) || d;
  const setParam = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in updates)) next.delete("page");
    setParams(next);
  };

  useEffect(() => { api.get("/products/categories").then((r) => setCategories(r.data)); }, []);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== get("search")) setParam({ search: searchInput });
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    api.get("/products", { params: Object.fromEntries(params) })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div>
      <div className="card mb-6 grid gap-3 p-4 md:grid-cols-5">
        <input className="input md:col-span-2" placeholder="Search products..." value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} />
        <select className="input" value={get("category")} onChange={(e) => setParam({ category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={get("sort", "newest")} onChange={(e) => setParam({ sort: e.target.value })}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A-Z</option>
        </select>
        <div className="flex gap-2">
          <input className="input" type="number" min="0" placeholder="Min $" value={get("minPrice")}
            onChange={(e) => setParam({ minPrice: e.target.value })} />
          <input className="input" type="number" min="0" placeholder="Max $" value={get("maxPrice")}
            onChange={(e) => setParam({ maxPrice: e.target.value })} />
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500">{data.total} product{data.total !== 1 && "s"} found</p>

      {loading ? (
        <p className="py-20 text-center text-gray-500">Loading products...</p>
      ) : data.products.length === 0 ? (
        <p className="py-20 text-center text-gray-500">No products match your filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      <Pagination page={data.page} pages={data.pages} onChange={(p) => setParam({ page: String(p) })} />
    </div>
  );
}
