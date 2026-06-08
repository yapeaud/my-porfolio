import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const items = await prisma.experience.findMany({ orderBy: { startDate: "desc" } });
  res.json(items);
}

export async function getOne(req, res) {
  const item = await prisma.experience.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return res.status(404).json({ message: "Expérience introuvable." });
  res.json(item);
}

export async function create(req, res) {
  const { company, position, startDate, endDate, description, location, order } = req.body;
  const item = await prisma.experience.create({
    data: {
      company, position, description, location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      logoUrl: req.file ? `/uploads/images/${req.file.filename}` : req.body.logoUrl,
      order: Number(order) || 0,
    },
  });
  res.status(201).json(item);
}

export async function update(req, res) {
  const { company, position, startDate, endDate, description, location, order } = req.body;
  const data = {
    company, position, description, location,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
    order: order !== undefined ? Number(order) : undefined,
  };
  if (req.file) data.logoUrl = `/uploads/images/${req.file.filename}`;
  const item = await prisma.experience.update({ where: { id: Number(req.params.id) }, data });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.experience.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
