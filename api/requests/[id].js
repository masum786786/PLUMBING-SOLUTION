import handler from "../requests.js";

export default async function dynamicHandler(req, res) {
  // Extract id from Vercel dynamic parameter if present
  if (req.query && req.query.id) {
    // req.query.id is populated by Vercel file routing
  }
  return handler(req, res);
}
