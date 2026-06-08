import { prisma } from "../lib/prisma.js";
import { slugify } from "../utils/slugify.js";
import fs from "fs";
import path from "path";

export async function getAll(req, res) {
  const { published, category, page = 1, limit = 6 } = req.query;
  const where = {};
  if (published !== undefined) where.published = published === "true";
  if (category) where.category = { slug: category };

  const total = await prisma.blogPost.count({ where });
  const posts = await prisma.blogPost.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    omit: { content: true },
  });
  res.json({ data: posts, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
}

export async function getOne(req, res) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: req.params.slug },
    include: { category: true },
  });
  if (!post) return res.status(404).json({ message: "Article introuvable." });
  res.json(post);
}

export async function create(req, res) {
  const { title, excerpt, content, metaTitle, metaDesc, categoryId } = req.body;
  let slug = slugify(title);
  const exists = await prisma.blogPost.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now()}`;
  const words = content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(words / 200);

  const post = await prisma.blogPost.create({
    data: {
      title, slug, excerpt, content, metaTitle, metaDesc, readingTime,
      categoryId: categoryId ? Number(categoryId) : null,
      coverImageUrl: req.file ? `/uploads/images/${req.file.filename}` : req.body.coverImageUrl,
    },
    include: { category: true },
  });
  res.status(201).json(post);
}

export async function update(req, res) {
  const { title, excerpt, content, metaTitle, metaDesc, categoryId } = req.body;
  const data = { excerpt, content, metaTitle, metaDesc };
  if (title) { data.title = title; data.slug = slugify(title); }
  if (content) data.readingTime = Math.ceil(content.split(/\s+/).length / 200);
  if (categoryId !== undefined) data.categoryId = categoryId ? Number(categoryId) : null;
  if (req.file) data.coverImageUrl = `/uploads/images/${req.file.filename}`;

  const post = await prisma.blogPost.update({
    where: { id: Number(req.params.id) },
    data,
    include: { category: true },
  });
  res.json(post);
}

export async function togglePublish(req, res) {
  const post = await prisma.blogPost.findUnique({ where: { id: Number(req.params.id) } });
  if (!post) return res.status(404).json({ message: "Article introuvable." });
  const updated = await prisma.blogPost.update({
    where: { id: post.id },
    data: {
      published: !post.published,
      publishedAt: !post.published ? new Date() : null,
    },
  });
  res.json(updated);
}

export async function remove(req, res) {
  const post = await prisma.blogPost.findUnique({ where: { id: Number(req.params.id) } });
  if (post?.coverImageUrl) {
    const p = path.join("uploads/images", path.basename(post.coverImageUrl));
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  await prisma.blogPost.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
