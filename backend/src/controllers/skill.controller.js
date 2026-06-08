import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  res.json(skills);
}

export async function getOne(req, res) {
  const skill = await prisma.skill.findUnique({ where: { id: Number(req.params.id) } });
  if (!skill) return res.status(404).json({ message: "Compétence introuvable." });
  res.json(skill);
}

export async function create(req, res) {
  const { name, category, level, iconUrl, order } = req.body;
  const skill = await prisma.skill.create({
    data: { name, category, level: Number(level) || 50, iconUrl, order: Number(order) || 0 },
  });
  res.status(201).json(skill);
}

export async function update(req, res) {
  const { name, category, level, iconUrl, order } = req.body;
  const skill = await prisma.skill.update({
    where: { id: Number(req.params.id) },
    data: { name, category, level: level !== undefined ? Number(level) : undefined, iconUrl, order: order !== undefined ? Number(order) : undefined },
  });
  res.json(skill);
}

export async function remove(req, res) {
  await prisma.skill.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
