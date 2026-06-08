export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({ message: "Cette valeur existe déjà." });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Ressource introuvable." });
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
  if (err.message && err.message.includes("Multipart")) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === "production" && status === 500
    ? "Erreur interne du serveur."
    : err.message || "Erreur interne du serveur.";

  res.status(status).json({ message });
}
