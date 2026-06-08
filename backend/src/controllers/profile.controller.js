import { prisma } from "../lib/prisma.js";
import path from "path";
import fs from "fs";

export async function getProfile(req, res) {
  const profile = await prisma.profile.findFirst();
  if (!profile) return res.status(404).json({ message: "Profil introuvable." });
  res.json(profile);
}

export async function updateProfile(req, res) {
  let profile = await prisma.profile.findFirst();
  const data = { ...req.body };

  if (req.file) {
    if (profile?.photoUrl) {
      const old = path.join("uploads", profile.photoUrl.replace(/^\/?(uploads\/)?/, ""));
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }
    data.photoUrl = `/uploads/images/${req.file.filename}`;
  }

  if (data.yearsOfExp) data.yearsOfExp = Number(data.yearsOfExp);
  if (data.projectsCount) data.projectsCount = Number(data.projectsCount);

  if (profile) {
    profile = await prisma.profile.update({ where: { id: profile.id }, data });
  } else {
    profile = await prisma.profile.create({ data });
  }
  res.json(profile);
}

export async function uploadCv(req, res) {
  if (!req.file) return res.status(400).json({ message: "Fichier PDF requis." });
  let profile = await prisma.profile.findFirst();
  if (profile?.cvUrl) {
    const old = path.join("uploads", profile.cvUrl.replace(/^\/?(uploads\/)?/, ""));
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }
  const cvUrl = `/uploads/documents/${req.file.filename}`;
  if (profile) {
    profile = await prisma.profile.update({ where: { id: profile.id }, data: { cvUrl } });
  } else {
    profile = await prisma.profile.create({ data: { cvUrl, name: "", title: "", bio: "", email: "" } });
  }
  res.json({ cvUrl: profile.cvUrl });
}
