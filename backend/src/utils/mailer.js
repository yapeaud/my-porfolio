import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

export async function sendContactEmail({ name, email, subject, message }) {
  if (!process.env.MAIL_USER || process.env.MAIL_USER === "your@gmail.com") {
    console.log("[MAIL] Skipped — SMTP not configured.");
    return;
  }
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: process.env.OWNER_EMAIL || process.env.MAIL_USER,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html: `<p><strong>De :</strong> ${name} &lt;${email}&gt;</p><p><strong>Sujet :</strong> ${subject}</p><hr/><p>${message.replace(/\n/g, "<br>")}</p>`,
  });
}

export async function sendAutoReply({ name, email }) {
  if (!process.env.MAIL_USER || process.env.MAIL_USER === "your@gmail.com") return;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: email,
    subject: "Votre message a bien été reçu",
    html: `<p>Bonjour ${name},</p><p>Merci pour votre message. Je reviendrai vers vous dans les plus brefs délais.</p><br><p>Cordialement</p>`,
  });
}
