import { prisma } from "../lib/prisma.js";

export async function getAll(req, res) {
  const items = await prisma.certification.findMany({ orderBy: { issueDate: "desc" } });
  res.json(items);
}

export async function getOne(req, res) {
  const item = await prisma.certification.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return res.status(404).json({ message: "Certification introuvable." });
  res.json(item);
}

export async function create(req, res) {
  const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, order } = req.body;
  const item = await prisma.certification.create({
    data: {
      title, issuer,
      issueDate: new Date(issueDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      credentialId, credentialUrl,
      imageUrl: req.file ? `/uploads/images/${req.file.filename}` : req.body.imageUrl,
      order: Number(order) || 0,
    },
  });
  res.status(201).json(item);
}

export async function update(req, res) {
  const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, order } = req.body;
  const data = {
    title, issuer,
    issueDate: issueDate ? new Date(issueDate) : undefined,
    expiryDate: expiryDate !== undefined ? (expiryDate ? new Date(expiryDate) : null) : undefined,
    credentialId, credentialUrl,
    order: order !== undefined ? Number(order) : undefined,
  };
  if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
  const item = await prisma.certification.update({ where: { id: Number(req.params.id) }, data });
  res.json(item);
}

export async function remove(req, res) {
  await prisma.certification.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
