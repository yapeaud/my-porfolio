import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  res.json(items);
}

export async function getOne(req, res) {
  const item = await prisma.testimonial.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return res.status(404).json({ message: "Témoignage introuvable." });
  res.json(item);
}

export async function create(req, res) {
  const { name, position, company, content, rating, order, featured } = req.body;
  const item = await prisma.testimonial.create({
    data: {
      name, position, company, content,
      rating: Number(rating) || 5,
      order: Number(order) || 0,
      featured: featured === "true" || featured === true,
      avatarUrl: req.file ? `/uploads/images/${req.file.filename}` : req.body.avatarUrl,
    },
  });
  res.status(201).json(item);
}

export async function update(req, res) {
  const { name, position, company, content, rating, order, featured } = req.body;
  const data = {
    name, position, company, content,
    rating: rating !== undefined ? Number(rating) : undefined,
    order: order !== undefined ? Number(order) : undefined,
    featured: featured !== undefined ? (featured === "true" || featured === true) : undefined,
  };
  if (req.file) data.avatarUrl = `/uploads/images/${req.file.filename}`;
  const item = await prisma.testimonial.update({ where: { id: Number(req.params.id) }, data });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
