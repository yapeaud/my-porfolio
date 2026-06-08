import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const items = await prisma.education.findMany({ orderBy: { startYear: "desc" } });
  res.json(items);
}

export async function getOne(req, res) {
  const item = await prisma.education.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return res.status(404).json({ message: "Formation introuvable." });
  res.json(item);
}

export async function create(req, res) {
  const { school, degree, field, startYear, endYear, description, logoUrl, order } = req.body;
  const item = await prisma.education.create({
    data: {
      school, degree, field,
      startYear: Number(startYear),
      endYear: endYear ? Number(endYear) : null,
      description,
      logoUrl: req.file ? `/uploads/images/${req.file.filename}` : logoUrl,
      order: Number(order) || 0,
    },
  });
  res.status(201).json(item);
}

export async function update(req, res) {
  const { school, degree, field, startYear, endYear, description, order } = req.body;
  const data = {
    school, degree, field,
    startYear: startYear ? Number(startYear) : undefined,
    endYear: endYear !== undefined ? (endYear ? Number(endYear) : null) : undefined,
    description,
    order: order !== undefined ? Number(order) : undefined,
  };
  if (req.file) data.logoUrl = `/uploads/images/${req.file.filename}`;
  const item = await prisma.education.update({ where: { id: Number(req.params.id) }, data });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.education.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
