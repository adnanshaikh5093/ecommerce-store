import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];
const products = Array.from({ length: 36 }, (_, i) => {
  const category = categories[i % categories.length];
  return {
    name: `${category} Item ${i + 1}`,
    description: `A quality ${category.toLowerCase()} product, number ${i + 1} in our catalog.`,
    price: Math.round((10 + Math.random() * 190) * 100) / 100,
    image: `https://picsum.photos/seed/product${i + 1}/400/300`,
    category,
    stock: 5 + (i % 20),
  };
});

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: { name: "Admin", email: "admin@example.com", password: await bcrypt.hash("admin123", 10), role: "ADMIN" },
  });
  await prisma.user.create({
    data: { name: "Demo User", email: "user@example.com", password: await bcrypt.hash("user123", 10) },
  });
  await prisma.product.createMany({ data: products });
  console.log("Seeded: admin@demo.local / DemoAdmin123!, user@demo.local / DemoUser123!");
}

main().finally(() => prisma.$disconnect());
