import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }
  const payload = { id: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email } });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token requis." });
  const payload = verifyRefreshToken(refreshToken);
  const accessToken = signAccessToken({ id: payload.id, email: payload.email });
  res.json({ accessToken });
}

export async function logout(req, res) {
  res.json({ message: "Déconnecté." });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
  res.json(user);
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || !(await comparePassword(currentPassword, user.passwordHash))) {
    return res.status(401).json({ message: "Mot de passe actuel incorrect." });
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  res.json({ message: "Mot de passe mis à jour." });
}
