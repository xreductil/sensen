import nodemailer from "nodemailer";

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8" },
});

const text = value => String(value ?? "").trim();

export default async function handler(request) {
  if (request.method !== "POST") return json({ error: "只接受 POST 請求。" }, 405);

  const smtpUser = text(process.env.SMTP_USER);
  const smtpPass = text(process.env.SMTP_PASS);
  const mailTo = text(process.env.MAIL_TO);
  if (!smtpUser || !smtpPass || !mailTo) {
    return json({ error: "寄信服務尚未完成環境變數設定。" }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "請提供有效的 JSON 資料。" }, 400);
  }

  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone);
  const subject = text(body.subject) || "網站聯絡通知";
  const message = text(body.message);
  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "請填寫姓名、有效 Email 與訊息內容。" }, 400);
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: text(process.env.SMTP_HOST) || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: mailTo,
      replyTo: email,
      subject: `[森森網站] ${subject}`,
      text: [`姓名：${name}`, `Email：${email}`, phone ? `電話：${phone}` : "", "", message].filter(Boolean).join("\n"),
    });
    return json({ ok: true, message: "通知信已寄出。" }, 201);
  } catch (error) {
    console.error("SMTP send failed", error instanceof Error ? error.message : error);
    return json({ error: "通知信寄送失敗，請稍後再試。" }, 502);
  }
}
