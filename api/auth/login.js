export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const { username, password } = body;
  const expectedUsername = process.env.ADMIN_USERNAME || "admin@123";
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin@123";

  if (username === expectedUsername && password === expectedPassword) {
    const token = "ps_token_" + Buffer.from(username + ":" + Date.now()).toString("hex");
    return res.status(200).json({
      success: true,
      token,
      user: { username },
    });
  }

  return res.status(401).json({ error: "Invalid username or password" });
}
