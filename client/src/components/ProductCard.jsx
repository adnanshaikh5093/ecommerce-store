import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { errMsg, money } from "../api";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!user) return navigate("/login");
    try { await add(product.id, 1); } catch (e) { alert(errMsg(e)); }
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase text-indigo-600">{product.category}</span>
        <Link to={`/products/${product.id}`} className="mt-1 font-semibold hover:underline">{product.name}</Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold">{money(product.price)}</span>
          <button className="btn" disabled={product.stock === 0} onClick={addToCart}>
            {product.stock === 0 ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
