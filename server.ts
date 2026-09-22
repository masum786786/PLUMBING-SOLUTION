import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory active auth tokens: token -> expiration timestamp
const activeTokens = new Map<string, number>();

// Supabase lazy client & table configuration
const SUPABASE_TABLE_PRIMARY = process.env.SUPABASE_TABLE || "PLUMBING SOLUTION";
const SUPABASE_TABLE_FALLBACK = "service_requests";

function sanitizeKey(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, "");
}

function getSupabaseClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const rawAnonKey = process.env.SUPABASE_ANON_KEY;

  const url = rawUrl ? rawUrl.trim().replace(/^["']|["']$/g, "") : "";
  const serviceKey = sanitizeKey(rawServiceKey);
  const anonKey = sanitizeKey(rawAnonKey);

  // Prefer service_role key as it has full administrative and RLS bypass permissions
  const key = serviceKey || anonKey;

  if (url && key) {
    try {
      return createClient(url, key);
    } catch (err) {
      console.error("Supabase client init error:", err);
    }
  }
  return null;
}

// Helper to sync incoming request to Supabase
async function syncRequestToSupabase(newRequest: ServiceRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  // 1. First attempt: Insert into "PLUMBING SOLUTION" matching user schema:
  // "FullName", "MobileNumber", "Address"
  try {
    const { error } = await supabase.from(SUPABASE_TABLE_PRIMARY).insert([
      {
        FullName: newRequest.full_name,
        MobileNumber: newRequest.mobile,
        Address: newRequest.address,
      },
    ]);

    if (!error) {
      console.log(`[Supabase] Successfully saved to "${SUPABASE_TABLE_PRIMARY}" table.`);
      return true;
    }

    console.warn(`[Supabase] Primary table "${SUPABASE_TABLE_PRIMARY}" insert failed:`, error.message);
  } catch (err) {
    console.warn(`[Supabase] Error writing to "${SUPABASE_TABLE_PRIMARY}":`, err);
  }

  // 2. Fallback attempt: Insert into standard service_requests table if present
  try {
    const { error: fbErr } = await supabase.from(SUPABASE_TABLE_FALLBACK).insert([
      {
        full_name: newRequest.full_name,
        address: newRequest.address,
        mobile: newRequest.mobile,
        work_details: newRequest.work_details,
        created_at: newRequest.created_at,
      },
    ]);

    if (!fbErr) {
      console.log(`[Supabase] Saved to fallback "${SUPABASE_TABLE_FALLBACK}" table.`);
      return true;
    }
  } catch (err) {
    console.warn(`[Supabase] Fallback insert error:`, err);
  }

  return false;
}

// Local persistent file storage
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "service_requests.json");

interface ServiceRequest {
  id: string;
  full_name: string;
  address: string;
  mobile: string;
  work_details: string;
  status: "New" | "Contacted" | "Completed";
  created_at: string;
}

function ensureDataFile(): ServiceRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialSeed: ServiceRequest[] = [
        {
          id: "req-101",
          full_name: "Abdulaziz Al-Otaibi",
          address: "Al Malaz District, Riyadh, Saudi Arabia",
          mobile: "+966501234567",
          work_details: "Need complete plumbing inspection and pipe replacement for a 3-story residential villa.",
          status: "New",
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: "req-102",
          full_name: "Tariq Mansoor",
          address: "Al Rawdah District, Jeddah, Saudi Arabia",
          mobile: "+966559876543",
          work_details: "Plumbing maintenance for 12 apartment units including water pressure pump servicing.",
          status: "Contacted",
          created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
        },
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2));
      return initialSeed;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading data file:", e);
    return [];
  }
}

function saveRequests(data: ServiceRequest[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error saving data file:", e);
  }
}

// Auth Middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }
  const token = authHeader.split(" ")[1];
  const exp = activeTokens.get(token);
  if (!exp || exp < Date.now()) {
    activeTokens.delete(token);
    return res.status(401).json({ error: "Session expired or invalid token. Please log in again." });
  }
  next();
}

// ---------------- API ROUTES ----------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Admin Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.ADMIN_USERNAME || "admin@123";
  const validPassword = process.env.ADMIN_PASSWORD || "admin@123";

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (username === validUsername && password === validPassword) {
    const token = crypto.randomBytes(32).toString("hex");
    // Token valid for 24 hours
    activeTokens.set(token, Date.now() + 24 * 60 * 60 * 1000);
    return res.json({
      success: true,
      token,
      user: { username: validUsername },
    });
  }

  return res.status(401).json({ error: "Invalid username or password" });
});

// Admin Check Me
app.get("/api/auth/me", requireAdminAuth, (req, res) => {
  res.json({ authenticated: true });
});

// Admin Logout
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeTokens.delete(token);
  }
  res.json({ success: true });
});

// Submit Service Request (Public)
app.post("/api/requests", async (req, res) => {
  try {
    const { full_name, address, mobile, work_details } = req.body;

    if (!full_name || !address || !mobile || !work_details) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest: ServiceRequest = {
      id: "req-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      full_name: String(full_name).trim(),
      address: String(address).trim(),
      mobile: String(mobile).trim(),
      work_details: String(work_details).trim(),
      status: "New",
      created_at: new Date().toISOString(),
    };

    // Save locally
    const existing = ensureDataFile();
    existing.unshift(newRequest);
    saveRequests(existing);

    // Sync to Supabase table ("PLUMBING SOLUTION" or fallback)
    await syncRequestToSupabase(newRequest);

    return res.status(201).json({
      success: true,
      message: "Thank you! Your service request has been submitted successfully.",
      data: newRequest,
    });
  } catch (err) {
    console.error("Error submitting request:", err);
    return res.status(500).json({ error: "Internal server error submitting request" });
  }
});

// Database Connection & Schema Status
app.get("/api/database/status", async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.json({
      configured: false,
      mode: "local_json",
      table: SUPABASE_TABLE_PRIMARY,
      message: "Supabase credentials not configured in environment. Using local persistent JSON storage.",
    });
  }

  try {
    const { data, error, count } = await supabase
      .from(SUPABASE_TABLE_PRIMARY)
      .select("*", { count: "exact", head: true });

    if (!error) {
      return res.json({
        configured: true,
        connected: true,
        mode: "supabase",
        table: SUPABASE_TABLE_PRIMARY,
        count: count ?? 0,
        message: `Successfully connected to Supabase table "${SUPABASE_TABLE_PRIMARY}".`,
      });
    }

    // Try fallback table
    const { error: fbErr, count: fbCount } = await supabase
      .from(SUPABASE_TABLE_FALLBACK)
      .select("*", { count: "exact", head: true });

    if (!fbErr) {
      return res.json({
        configured: true,
        connected: true,
        mode: "supabase",
        table: SUPABASE_TABLE_FALLBACK,
        count: fbCount ?? 0,
        message: `Connected to fallback table "${SUPABASE_TABLE_FALLBACK}".`,
      });
    }

    return res.json({
      configured: true,
      connected: false,
      mode: "local_json_fallback",
      table: SUPABASE_TABLE_PRIMARY,
      error: error.message,
      message: `Supabase configured, but table "${SUPABASE_TABLE_PRIMARY}" could not be queried: ${error.message}`,
    });
  } catch (err: any) {
    return res.json({
      configured: true,
      connected: false,
      mode: "local_json_fallback",
      table: SUPABASE_TABLE_PRIMARY,
      error: err.message,
    });
  }
});

// Get all Service Requests (Admin Only)
app.get("/api/requests", requireAdminAuth, async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      // 1. Try querying primary table: "PLUMBING SOLUTION"
      try {
        const { data, error } = await supabase
          .from(SUPABASE_TABLE_PRIMARY)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const normalized: ServiceRequest[] = data.map((row: any) => ({
            id: String(row.id),
            full_name: row.FullName || row.full_name || "Client",
            mobile: row.MobileNumber || row.mobile || "",
            address: row.Address || row.address || "",
            work_details:
              row.WorkDetails ||
              row.work_details ||
              row.work ||
              "Plumbing inspection & service request",
            status: (row.status as any) || "New",
            created_at: row.created_at || new Date().toISOString(),
          }));

          // Merge any local entries not present in Supabase
          const localRequests = ensureDataFile();
          const remoteIds = new Set(normalized.map((r) => r.id));
          const uniqueLocal = localRequests.filter((r) => !remoteIds.has(r.id));

          return res.json({ requests: [...normalized, ...uniqueLocal] });
        } else if (error) {
          console.warn(`Querying "${SUPABASE_TABLE_PRIMARY}" returned:`, error.message);
        }
      } catch (sbErr) {
        console.warn(`Supabase primary table fetch error:`, sbErr);
      }

      // 2. Try querying fallback table: "service_requests"
      try {
        const { data: fbData, error: fbErr } = await supabase
          .from(SUPABASE_TABLE_FALLBACK)
          .select("*")
          .order("created_at", { ascending: false });

        if (!fbErr && fbData && fbData.length > 0) {
          const normalized: ServiceRequest[] = fbData.map((row: any) => ({
            id: String(row.id),
            full_name: row.full_name || row.FullName || "Client",
            mobile: row.mobile || row.MobileNumber || "",
            address: row.address || row.Address || "",
            work_details: row.work_details || row.WorkDetails || "Plumbing inquiry",
            status: (row.status as any) || "New",
            created_at: row.created_at || new Date().toISOString(),
          }));
          return res.json({ requests: normalized });
        }
      } catch (sbErr) {
        console.warn("Supabase fallback fetch failed:", sbErr);
      }
    }

    const requests = ensureDataFile();
    return res.json({ requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    return res.status(500).json({ error: "Failed to retrieve requests" });
  }
});

// Update Request Status (Admin Only)
app.patch("/api/requests/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "Contacted", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const requests = ensureDataFile();
    const index = requests.findIndex((r) => r.id === id);
    if (index !== -1) {
      requests[index].status = status as "New" | "Contacted" | "Completed";
      saveRequests(requests);
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      const isNumeric = /^\d+$/.test(id);
      const queryId = isNumeric ? Number(id) : id;

      try {
        // Attempt update in "PLUMBING SOLUTION"
        await supabase
          .from(SUPABASE_TABLE_PRIMARY)
          .update({ status })
          .eq("id", queryId);
      } catch {
        // Fallback update in "service_requests"
        try {
          await supabase
            .from(SUPABASE_TABLE_FALLBACK)
            .update({ status })
            .eq("id", queryId);
        } catch {}
      }
    }

    return res.json({
      success: true,
      request: index !== -1 ? requests[index] : { id, status },
    });
  } catch (err) {
    console.error("Error updating request:", err);
    return res.status(500).json({ error: "Failed to update request" });
  }
});

// Delete Request (Admin Only)
app.delete("/api/requests/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let requests = ensureDataFile();
    requests = requests.filter((r) => r.id !== id);
    saveRequests(requests);

    const supabase = getSupabaseClient();
    if (supabase) {
      const isNumeric = /^\d+$/.test(id);
      const queryId = isNumeric ? Number(id) : id;

      try {
        await supabase
          .from(SUPABASE_TABLE_PRIMARY)
          .delete()
          .eq("id", queryId);
      } catch {
        try {
          await supabase
            .from(SUPABASE_TABLE_FALLBACK)
            .delete()
            .eq("id", queryId);
        } catch {}
      }
    }

    return res.json({ success: true, message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err);
    return res.status(500).json({ error: "Failed to delete request" });
  }
});

// ---------------- VITE & STATIC SERVING ----------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Plumbing Solution server running on http://0.0.0.0:${PORT}`);
  });
}

start();
