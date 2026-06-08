import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@portfolio.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, passwordHash } });
    console.log(`Admin user created: ${email}`);
  } else {
    console.log("Admin user already exists.");
  }

  const profileExists = await prisma.profile.findFirst();
  if (!profileExists) {
    await prisma.profile.create({
      data: {
        name: "Abednego Yapeaud",
        title: "Développeur Full Stack",
        bio: "Passionné par le développement web moderne, je crée des applications performantes et des expériences utilisateurs exceptionnelles.",
        email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
        location: "Côte d'Ivoire",
        yearsOfExp: 3,
        projectsCount: 0,
      },
    });
    console.log("Default profile created.");
  }

  const catCount = await prisma.category.count();
  if (catCount === 0) {
    await prisma.category.createMany({
      data: [
        { name: "Web", slug: "web" },
        { name: "Mobile", slug: "mobile" },
        { name: "API", slug: "api" },
        { name: "DevOps", slug: "devops" },
      ],
    });
    console.log("Default categories created.");
  }

  const techCount = await prisma.tech.count();
  if (techCount === 0) {
    await prisma.tech.createMany({
      data: [
        { name: "React" },
        { name: "Node.js" },
        { name: "PostgreSQL" },
        { name: "TypeScript" },
        { name: "Docker" },
        { name: "Tailwind CSS" },
      ],
    });
    console.log("Default techs created.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
