import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const include = { items: { include: { product: true } } };

// Checkout: converts the cart into an order inside a single transaction
router.post("/", async (req, res) => {
  const { address } = req.body;
  if (!address?.trim()) return res.status(400).json({ message: "Shipping address is required" });

  try {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cartItem.findMany({ where: { userId: req.user.id }, include: { product: true } });
      if (!cart.length) throw new Error("Your cart is empty");

      for (const item of cart) {
        if (item.quantity > item.product.stock)
          throw new Error(`"${item.product.name}" only has ${item.product.stock} left`);
      }

      const total = cart.reduce((sum, i) => sum + i.quantity * i.product.price, 0);
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          total: Math.round(total * 100) / 100,
          address,
          items: { create: cart.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.product.price })) },
        },
        include,
      });

      for (const item of cart)
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
      return created;
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) =>
  res.json(await prisma.order.findMany({ where: { userId: req.user.id }, include, orderBy: { createdAt: "desc" } }))
);

// Admin: all orders
router.get("/admin/all", requireAdmin, async (_req, res) =>
  res.json(await prisma.order.findMany({
    include: { ...include, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  }))
);

router.patch("/:id/status", requireAdmin, async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  try {
    res.json(await prisma.order.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status } }));
  } catch {
    res.status(404).json({ message: "Order not found" });
  }
});

router.get("/:id", async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) }, include });
  if (!order || (order.userId !== req.user.id && req.user.role !== "ADMIN"))
    return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
