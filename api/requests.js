import { createClient } from "@supabase/supabase-js";

function sanitizeKey(val) {
  if (!val) return "";
  return String(val).trim().replace(/^["']|["']$/g, "").replace(/\s+/g, "");
}

function getSupabase() {
  const rawUrl = process.env.SUPABASE_URL;
  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const rawAnonKey = process.env.SUPABASE_ANON_KEY;

  const url = rawUrl ? String(rawUrl).trim().replace(/^["']|["']$/g, "") : "";
  const key = sanitizeKey(rawServiceKey) || sanitizeKey(rawAnonKey);

  if (url && key) {
    try {
      return createClient(url, key, {
        auth: { persistSession: false },
      });
    } catch (err) {
      console.error("[Vercel API] Supabase client init error:", err);
    }
  }
  return null;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Parse body safely
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const primaryTable = process.env.SUPABASE_TABLE || "PLUMBING SOLUTION";
  const fallbackTable = "service_requests";
  const supabase = getSupabase();

  // POST: Create a new service inquiry from contact/estimate form
  if (req.method === "POST") {
    const fullName = body.full_name || body.FullName || body.fullName || body.name;
    const mobile = body.mobile || body.MobileNumber || body.phone;
    const address = body.address || body.Address;
    const workDetails = body.work_details || body.WorkDetails || body.work || body.details || "";

    if (!fullName || !mobile || !address) {
      return res.status(400).json({
        error: "Missing required fields: full_name, mobile, and address are required.",
      });
    }

    const newRequest = {
      id: "req-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      full_name: String(fullName).trim(),
      mobile: String(mobile).trim(),
      address: String(address).trim(),
      work_details: String(workDetails).trim(),
      status: "New",
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        // Attempt 1: Insert into primary table "PLUMBING SOLUTION"
        const { error: insertErr } = await supabase.from(primaryTable).insert([
          {
            FullName: newRequest.full_name,
            MobileNumber: newRequest.mobile,
            Address: newRequest.address,
          },
        ]);

        if (insertErr) {
          console.warn(`[Vercel API] Insert to "${primaryTable}" error:`, insertErr.message);
          // Attempt 2: Fallback table
          await supabase.from(fallbackTable).insert([
            {
              full_name: newRequest.full_name,
              address: newRequest.address,
              mobile: newRequest.mobile,
              work_details: newRequest.work_details,
              created_at: newRequest.created_at,
            },
          ]);
        }
      } catch (sbErr) {
        console.warn("[Vercel API] Supabase write error:", sbErr);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Thank you! Your service request has been submitted successfully.",
      data: newRequest,
    });
  }

  // GET: Fetch all service requests
  if (req.method === "GET") {
    if (!supabase) {
      return res.status(200).json({ requests: [] });
    }

    try {
      // 1. Fetch from primary table "PLUMBING SOLUTION"
      const { data, error } = await supabase
        .from(primaryTable)
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const normalized = data.map((row) => ({
          id: String(row.id),
          full_name: row.FullName || row.full_name || "Client",
          mobile: row.MobileNumber || row.mobile || "",
          address: row.Address || row.address || "",
          work_details:
            row.WorkDetails ||
            row.work_details ||
            row.work ||
            "Plumbing inspection & service request",
          status: row.status || "New",
          created_at: row.created_at || new Date().toISOString(),
        }));
        return res.status(200).json({ requests: normalized });
      }

      // 2. Fetch from fallback table if primary had error or was empty
      const { data: fbData, error: fbErr } = await supabase
        .from(fallbackTable)
        .select("*")
        .order("created_at", { ascending: false });

      if (!fbErr && fbData) {
        const normalized = fbData.map((row) => ({
          id: String(row.id),
          full_name: row.full_name || row.FullName || "Client",
          mobile: row.mobile || row.MobileNumber || "",
          address: row.address || row.Address || "",
          work_details: row.work_details || row.WorkDetails || "Plumbing inquiry",
          status: row.status || "New",
          created_at: row.created_at || new Date().toISOString(),
        }));
        return res.status(200).json({ requests: normalized });
      }

      return res.status(200).json({ requests: [] });
    } catch (err) {
      console.error("[Vercel API] Fetch requests error:", err);
      return res.status(500).json({ error: "Failed to retrieve requests" });
    }
  }

  // PATCH: Update request status
  if (req.method === "PATCH") {
    const id = req.query.id || body.id;
    const status = body.status;

    if (!id || !status) {
      return res.status(400).json({ error: "Missing id or status" });
    }

    if (supabase) {
      const isNumeric = /^\d+$/.test(String(id));
      const queryId = isNumeric ? Number(id) : id;

      try {
        await supabase.from(primaryTable).update({ status }).eq("id", queryId);
      } catch {
        try {
          await supabase.from(fallbackTable).update({ status }).eq("id", queryId);
        } catch {}
      }
    }

    return res.status(200).json({
      success: true,
      request: { id: String(id), status },
    });
  }

  // DELETE: Remove request
  if (req.method === "DELETE") {
    const id = req.query.id || body.id;
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    if (supabase) {
      const isNumeric = /^\d+$/.test(String(id));
      const queryId = isNumeric ? Number(id) : id;

      try {
        await supabase.from(primaryTable).delete().eq("id", queryId);
      } catch {
        try {
          await supabase.from(fallbackTable).delete().eq("id", queryId);
        } catch {}
      }
    }

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
