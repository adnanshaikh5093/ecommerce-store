import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
router.get("/", async (req, res) => {
  const { search, category, minPrice, maxPrice, sort = "newest" } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);

  const where = {};
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
  ];
  if (category) where.category = category;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const orderBy = {
    newest: { createdAt: "desc" },
    "price-asc": { price: "asc" },
    "price-desc": { price: "desc" },
    name: { name: "asc" },
  }[sort] || { createdAt: "desc" };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
  ]);
  res.json({ products, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

router.get("/categories", async (_req, res) => {
  const rows = await prisma.product.findMany({ distinct: ["category"], select: { category: true } });
  res.json(rows.map((r) => r.category).sort());
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

const parseBody = (b) => ({
  name: b.name,
  description: b.description,
  price: parseFloat(b.price),
  image: b.image || null,
  category: b.category,
  stock: parseInt(b.stock),
});
const valid = (d) => d.name && d.description && d.category && d.price >= 0 && d.stock >= 0;

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const data = parseBody(req.body);
  if (!valid(data)) return res.status(400).json({ message: "Invalid product data" });
  res.status(201).json(await prisma.product.create({ data }));
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const data = parseBody(req.body);
  if (!valid(data)) return res.status(400).json({ message: "Invalid product data" });
  try {
    res.json(await prisma.product.update({ where: { id: Number(req.params.id) }, data }));
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const used = await prisma.orderItem.count({ where: { productId: id } });
  if (used) return res.status(409).json({ message: "Product is part of existing orders; set stock to 0 instead" });
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

export default router;
