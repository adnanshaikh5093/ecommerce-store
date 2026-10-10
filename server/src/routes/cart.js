import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const getCart = (userId) =>
  prisma.cartItem.findMany({ where: { userId }, include: { product: true }, orderBy: { id: "asc" } });

router.get("/", async (req, res) => res.json(await getCart(req.user.id)));

router.post("/", async (req, res) => {
  const productId = Number(req.body.productId);
  const quantity = Math.max(parseInt(req.body.quantity) || 1, 1);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.user.id, productId } },
  });
  const newQty = (existing?.quantity || 0) + quantity;
  if (newQty > product.stock) return res.status(400).json({ message: `Only ${product.stock} in stock` });

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: { quantity: newQty },
    create: { userId: req.user.id, productId, quantity },
  });
  res.json(await getCart(req.user.id));
});

router.put("/:productId", async (req, res) => {
  const productId = Number(req.params.productId);
  const quantity = parseInt(req.body.quantity);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !(quantity >= 1)) return res.status(400).json({ message: "Invalid request" });
  if (quantity > product.stock) return res.status(400).json({ message: `Only ${product.stock} in stock` });
  await prisma.cartItem.update({
    where: { userId_productId: { userId: req.user.id, productId } },
    data: { quantity },
  });
  res.json(await getCart(req.user.id));
});

router.delete("/:productId", async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id, productId: Number(req.params.productId) } });
  res.json(await getCart(req.user.id));
});

export default router;
