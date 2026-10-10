import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { errMsg, money } from "../api";

export default function Cart() {
  const { items, total, update, remove } = useCart();

  const change = async (id, qty) => { try { await update(id, qty); } catch (e) { alert(errMsg(e)); } };

  if (!items.length)
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link to="/" className="btn mt-4">Continue shopping</Link>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card divide-y lg:col-span-2">
        {items.map(({ id, quantity, product }) => (
          <div key={id} className="flex items-center gap-4 p-4">
            <img src={product.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <Link to={`/products/${product.id}`} className="font-semibold hover:underline">{product.name}</Link>
              <p className="text-sm text-gray-500">{money(product.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-outline px-3" disabled={quantity <= 1} onClick={() => change(product.id, quantity - 1)}>−</button>
              <span className="w-6 text-center">{quantity}</span>
              <button className="btn-outline px-3" onClick={() => change(product.id, quantity + 1)}>+</button>
            </div>
            <p className="w-20 text-right font-semibold">{money(quantity * product.price)}</p>
            <button className="text-sm text-red-600 hover:underline" onClick={() => remove(product.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="card h-fit p-6">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="mt-4 flex justify-between"><span>Total</span><span className="font-bold">{money(total)}</span></div>
        <Link to="/checkout" className="btn mt-6 w-full">Proceed to checkout</Link>
      </div>
    </div>
  );
}
