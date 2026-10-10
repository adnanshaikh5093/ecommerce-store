import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const link = ({ isActive }) => `text-sm font-medium ${isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">ShopHub</Link>
        <div className="flex items-center gap-5">
          <NavLink to="/" className={link}>Shop</NavLink>
          {user && <NavLink to="/orders" className={link}>Orders</NavLink>}
          {user?.role === "ADMIN" && <NavLink to="/admin" className={link}>Admin</NavLink>}
          <NavLink to="/cart" className={link}>Cart ({count})</NavLink>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-500 sm:inline">Hi, {user.name}</span>
              <button className="btn-outline" onClick={() => { logout(); navigate("/"); }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
