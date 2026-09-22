export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ps_token_") || authHeader.startsWith("Bearer ")) {
    const adminUsername = process.env.ADMIN_USERNAME || "admin@123";
    return res.status(200).json({
      valid: true,
      user: { username: adminUsername },
    });
  }

  return res.status(401).json({ error: "Unauthorized" });
}
