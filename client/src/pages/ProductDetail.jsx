import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errMsg, money } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => { api.get(`/products/${id}`).then((r) => setProduct(r.data)).catch(() => setProduct(false)); }, [id]);

  if (product === null) return <p className="py-20 text-center text-gray-500">Loading...</p>;
  if (product === false) return <p className="py-20 text-center text-gray-500">Product not found.</p>;

  const addToCart = async () => {
    if (!user) return navigate("/login");
    try { await add(product.id, qty); setMsg("Added to cart!"); } catch (e) { setMsg(errMsg(e)); }
  };

  return (
    <div className="card grid gap-8 p-6 md:grid-cols-2">
      <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />
      <div>
        <span className="text-xs font-medium uppercase text-indigo-600">{product.category}</span>
        <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl font-semibold">{money(product.price)}</p>
        <p className="mt-4 text-gray-600">{product.description}</p>
        <p className={`mt-4 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        {product.stock > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <input type="number" min="1" max={product.stock} value={qty} className="input w-24"
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
            <button className="btn" onClick={addToCart}>Add to cart</button>
          </div>
        )}
        {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
      </div>
    </div>
  );
}
