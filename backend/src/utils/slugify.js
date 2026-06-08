export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

export function uniqueSlug(base, suffix = "") {
  const s = suffix ? `${base}-${suffix}` : base;
  return slugify(s);
}
