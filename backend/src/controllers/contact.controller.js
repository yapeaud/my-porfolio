import { prisma } from "../lib/prisma.js";
import { sendContactEmail, sendAutoReply } from "../utils/mailer.js";

export async function submit(req, res) {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }
  const msg = await prisma.contactMessage.create({ data: { name, email, subject, message } });
  try {
    await sendContactEmail({ name, email, subject, message });
    await sendAutoReply({ name, email });
  } catch (e) {
    console.error("[MAIL ERROR]", e.message);
  }
  res.status(201).json({ message: "Message envoyé avec succès.", id: msg.id });
}

export async function getAll(req, res) {
  const { isRead, page = 1, limit = 20 } = req.query;
  const where = {};
  if (isRead !== undefined) where.isRead = isRead === "true";
  const total = await prisma.contactMessage.count({ where });
  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  res.json({ data: messages, total });
}

export async function getOne(req, res) {
  const msg = await prisma.contactMessage.findUnique({ where: { id: Number(req.params.id) } });
  if (!msg) return res.status(404).json({ message: "Message introuvable." });
  if (!msg.isRead) {
    await prisma.contactMessage.update({ where: { id: msg.id }, data: { isRead: true } });
    msg.isRead = true;
  }
  res.json(msg);
}

export async function toggleRead(req, res) {
  const msg = await prisma.contactMessage.findUnique({ where: { id: Number(req.params.id) } });
  if (!msg) return res.status(404).json({ message: "Message introuvable." });
  const updated = await prisma.contactMessage.update({
    where: { id: msg.id },
    data: { isRead: !msg.isRead },
  });
  res.json(updated);
}

export async function remove(req, res) {
  await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
}
