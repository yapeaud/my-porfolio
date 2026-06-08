import { prisma } from "../lib/prisma.js";

export async function getStats(req, res) {
  const [projects, skills, certifications, diplomas, experiences, messages, unreadMessages, testimonials, posts] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.certification.count(),
    prisma.diploma.count(),
    prisma.experience.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.testimonial.count(),
    prisma.blogPost.count(),
  ]);
  res.json({ projects, skills, certifications, diplomas, experiences, messages, unreadMessages, testimonials, posts });
}
