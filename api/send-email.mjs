import nodemailer from "nodemailer";

const json = (response, body, status = 200) => response.status(status).json(body);

const text = value => String(value ?? "").trim();

const detailValue = (message, label) => {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text(message.match(new RegExp(`^${escapedLabel}：?(.*)$`, "m"))?.[1]);
};

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, { error: "只接受 POST 請求。" }, 405);

  const smtpUser = text(process.env.SMTP_USER);
  const smtpPass = text(process.env.SMTP_PASS);
  const mailTo = text(process.env.MAIL_TO);
  if (!smtpUser || !smtpPass || !mailTo) {
    return json(response, { error: "寄信服務尚未完成環境變數設定。" }, 503);
  }

  let body;
  try { body = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {}; }
  catch { return json(response, { error: "請提供有效的 JSON 資料。" }, 400); }

  const name = text(body.name);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone);
  const subject = text(body.subject) || "網站聯絡通知";
  const message = text(body.message);
  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return json(response, { error: "請填寫姓名、有效 Email 與訊息內容。" }, 400);
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: text(process.env.SMTP_HOST) || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const details = [
    `姓名：${name}`,
    `Email：${email}`,
    phone ? `電話：${phone}` : "",
    "",
    message,
  ].filter(Boolean).join("\n");
  const isTasteApplication = subject === "彌月試吃申請";
  const produced = detailValue(message, "是否已生產");
  const deliveryMethod = detailValue(message, "領取方式");
  const tasteMail = [
    "郵件內容來自 森森官網-彌月試吃申請",
    "===== 以下為內容 ====",
    `媽咪姓名: ${name}`,
    `電子信箱: ${email}`,
    `連絡電話: ${phone}`,
    "======",
    `寶寶性別: ${detailValue(message, "寶寶性別")}`,
    `是否已生產: ${produced}`,
    `媽媽預產期／請輸入寶寶的滿月日期: ${produced === "是" ? detailValue(message, "滿月日期") : detailValue(message, "預產期")}`,
    `產檢醫院／生產醫院: ${produced === "是" ? detailValue(message, "生產醫院") : detailValue(message, "產檢醫院")}`,
    "======",
    `彌月試吃領取方式: ${deliveryMethod}`,
    `宅配地址／自取門市: ${deliveryMethod === "宅配" ? detailValue(message, "宅配地址") : detailValue(message, "自取門市")}`,
    `宅配日期／自取日期: ${deliveryMethod === "宅配" ? detailValue(message, "到貨日期") : detailValue(message, "自取日期")}`,
    "----完畢----",
    "",
    "這封電子郵件由《森森點心坊》\"彌月試吃申請表單\"傳送，網站網址為 https://www.sensen.com.tw",
  ].join("\n");
  const storeSubject = subject === "彌月試吃申請"
    ? `顧客「${name}」的彌月試吃申請單`
    : `[森森網站] ${subject}`;

  try {
    // 店家通知：直接回覆這封信即可聯絡客戶。
    await transporter.sendMail({
      from: smtpUser,
      to: mailTo,
      replyTo: email,
      subject: storeSubject,
      text: isTasteApplication ? tasteMail : details,
    });

    // 客戶確認信：讓申請人知道表單已被系統收到。
    await transporter.sendMail({
      from: smtpUser,
      to: email,
      subject: "森森點心坊已收到您的申請",
      text: [
        `您好 ${name}：`,
        "",
        `我們已收到您的「${subject}」申請，內容如下：`,
        "",
        message,
        "",
        "森森點心坊會再與您聯絡，謝謝。",
      ].join("\n"),
    });
    return json(response, {
      ok: true,
      message: "店家與客戶通知信已寄出。",
      email: { store: true, customer: true },
    }, 201);
  } catch (error) {
    console.error("SMTP send failed", error instanceof Error ? error.message : error);
    return json(response, { error: "通知信寄送失敗，請稍後再試。" }, 502);
  }
}
