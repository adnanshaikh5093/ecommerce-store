import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Not authenticated" });
  try {
    const { id } = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admin access required" });
  next();
};
