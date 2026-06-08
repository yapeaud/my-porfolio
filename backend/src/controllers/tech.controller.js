import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const items = await prisma.tech.findMany({ orderBy: { name: "asc" } });
  res.json(items);
}

export async function create(req, res) {
  const { name } = req.body;
  const item = await prisma.tech.create({ data: { name } });
  res.status(201).json(item);
}

export async function update(req, res) {
  const item = await prisma.tech.update({
    where: { id: Number(req.params.id) },
    data: { name: req.body.name },
  });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.tech.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
