import { prisma } from "../lib/prisma.js";
import { slugify } from "../utils/slugify.js";

export async function getAll(req, res) {
  const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(items);
}

export async function create(req, res) {
  const { name } = req.body;
  const slug = slugify(name);
  const item = await prisma.category.create({ data: { name, slug } });
  res.status(201).json(item);
}

export async function update(req, res) {
  const { name } = req.body;
  const data = { name };
  if (name) data.slug = slugify(name);
  const item = await prisma.category.update({ where: { id: Number(req.params.id) }, data });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
