export const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "Tools", "DevOps"];

export const PROJECT_STATUSES = [
  { value: "completed", label: "Terminé" },
  { value: "in-progress", label: "En cours" },
  { value: "archived", label: "Archivé" },
];

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4001/api";
export const UPLOADS_BASE = "http://localhost:4001";
