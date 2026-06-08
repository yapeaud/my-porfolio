import { prisma } from "../lib/prisma.js";
import { slugify } from "../utils/slugify.js";
import fs from "fs";
import path from "path";

const UPLOADS = "uploads/images";

export async function getAll(req, res) {
  const { search, category, tech, featured, status, page = 1, limit = 9 } = req.query;
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };
  if (tech) where.techs = { some: { name: { equals: tech, mode: "insensitive" } } };
  if (featured !== undefined) where.featured = featured === "true";
  if (status) where.status = status;

  const total = await prisma.project.count({ where });
  const projects = await prisma.project.findMany({
    where,
    include: { category: true, techs: true, images: { orderBy: { order: "asc" } } },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  res.json({ data: projects, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
}

export async function getOne(req, res) {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, techs: true, images: { orderBy: { order: "asc" } } },
  });
  if (!project) return res.status(404).json({ message: "Projet introuvable." });
  res.json(project);
}

export async function create(req, res) {
  const { title, description, summary, liveUrl, repoUrl, featured, status, order, categoryId, techIds } = req.body;
  let slug = slugify(title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const techConnect = techIds
    ? (Array.isArray(techIds) ? techIds : techIds.split(",")).map((id) => ({ id: Number(id) }))
    : [];

  const project = await prisma.project.create({
    data: {
      title, slug, description, summary, liveUrl, repoUrl,
      featured: featured === "true" || featured === true,
      status: status || "completed",
      order: Number(order) || 0,
      categoryId: categoryId ? Number(categoryId) : null,
      techs: { connect: techConnect },
    },
    include: { category: true, techs: true, images: true },
  });

  if (req.files && req.files.length > 0) {
    const imageData = req.files.map((f, i) => ({
      url: `/uploads/images/${f.filename}`,
      isPrimary: i === 0,
      order: i,
      projectId: project.id,
    }));
    await prisma.projectImage.createMany({ data: imageData });
  }

  const full = await prisma.project.findUnique({
    where: { id: project.id },
    include: { category: true, techs: true, images: { orderBy: { order: "asc" } } },
  });
  res.status(201).json(full);
}

export async function update(req, res) {
  const { title, description, summary, liveUrl, repoUrl, featured, status, order, categoryId, techIds } = req.body;
  const data = {
    description, summary, liveUrl, repoUrl,
    featured: featured !== undefined ? (featured === "true" || featured === true) : undefined,
    status,
    order: order !== undefined ? Number(order) : undefined,
    categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : undefined,
  };
  if (title) { data.title = title; data.slug = slugify(title); }

  const techConnect = techIds
    ? (Array.isArray(techIds) ? techIds : techIds.split(",")).map((id) => ({ id: Number(id) }))
    : undefined;

  const project = await prisma.project.update({
    where: { id: Number(req.params.id) },
    data: {
      ...data,
      ...(techConnect !== undefined ? { techs: { set: techConnect } } : {}),
    },
    include: { category: true, techs: true, images: { orderBy: { order: "asc" } } },
  });

  if (req.files && req.files.length > 0) {
    const imageData = req.files.map((f, i) => ({
      url: `/uploads/images/${f.filename}`,
      isPrimary: false,
      order: (project.images?.length || 0) + i,
      projectId: project.id,
    }));
    await prisma.projectImage.createMany({ data: imageData });
  }
  res.json(project);
}

export async function remove(req, res) {
  const project = await prisma.project.findUnique({
    where: { id: Number(req.params.id) },
    include: { images: true },
  });
  if (!project) return res.status(404).json({ message: "Projet introuvable." });
  for (const img of project.images) {
    const p = path.join(UPLOADS, path.basename(img.url));
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  await prisma.project.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}

export async function removeImage(req, res) {
  const img = await prisma.projectImage.findUnique({ where: { id: Number(req.params.imageId) } });
  if (!img) return res.status(404).json({ message: "Image introuvable." });
  const p = path.join(UPLOADS, path.basename(img.url));
  if (fs.existsSync(p)) fs.unlinkSync(p);
  await prisma.projectImage.delete({ where: { id: img.id } });
  res.status(204).end();
}
