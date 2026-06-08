import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const items = await prisma.diploma.findMany({ orderBy: { year: "desc" } });
  res.json(items);
}

export async function getOne(req, res) {
  const item = await prisma.diploma.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return res.status(404).json({ message: "Diplôme introuvable." });
  res.json(item);
}

export async function create(req, res) {
  const { title, institution, year, order } = req.body;
  const item = await prisma.diploma.create({
    data: {
      title, institution,
      year: Number(year),
      imageUrl: req.file ? `/uploads/images/${req.file.filename}` : req.body.imageUrl,
      order: Number(order) || 0,
    },
  });
  res.status(201).json(item);
}

export async function update(req, res) {
  const { title, institution, year, order } = req.body;
  const data = {
    title, institution,
    year: year ? Number(year) : undefined,
    order: order !== undefined ? Number(order) : undefined,
  };
  if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
  const item = await prisma.diploma.update({ where: { id: Number(req.params.id) }, data });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.diploma.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
