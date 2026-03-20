import express, { Request, Response } from "express";
import { query } from "../db";
import roleMiddleware from "../middleware/role";
import validateListingsQuery from "../middleware/validate";

const router = express.Router();

router.use(roleMiddleware);

router.get("/", validateListingsQuery, async (req: Request, res: Response) => {
  try {
    const {
      price_min,
      price_max,
      beds,
      baths,
      property_type,
      suburb,
      keyword,
      status = "active",
      page = 1,
      limit = 10,
    } = req.query as Record<string, string | undefined> & {
      status?: string;
      page?: string | number;
      limit?: string | number;
    };

    const conditions: string[] = [];
    const params: unknown[] = [];

    const addParam = (value: unknown): string => {
      params.push(value);
      return `$${params.length}`;
    };

    if (price_min) {
      conditions.push(`p.price >= ${addParam(Number(price_min))}`);
    }
    if (price_max) {
      conditions.push(`p.price <= ${addParam(Number(price_max))}`);
    }
    if (beds) {
      conditions.push(`p.beds >= ${addParam(Number(beds))}`);
    }
    if (baths) {
      conditions.push(`p.baths >= ${addParam(Number(baths))}`);
    }
    if (property_type) {
      conditions.push(
        `p.property_type = ${addParam(property_type.toLowerCase())}`,
      );
    }
    if (suburb) {
      conditions.push(`p.suburb ILIKE ${addParam(`%${suburb}%`)}`);
    }
    if (status) {
      conditions.push(`p.status = ${addParam(status)}`);
    }
    if (keyword) {
      conditions.push(
        `to_tsvector('english', p.title || ' ' || COALESCE(p.description, ''))
         @@ plainto_tsquery('english', ${addParam(keyword)})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit))));
    const offset = (pageNum - 1) * limitNum;

    const internalNotesField = req.isAdmin
      ? "p.internal_notes"
      : "NULL AS internal_notes";

    const limitPlaceholder = addParam(limitNum);
    const offsetPlaceholder = addParam(offset);

    const dataQuery = `
      SELECT
        p.id,
        p.title,
        p.price,
        p.suburb,
        p.state,
        p.postcode,
        p.property_type,
        p.beds,
        p.baths,
        p.car_spaces,
        p.land_size_sqm,
        p.status,
        p.created_at,
        ${internalNotesField},
        a.id        AS agent_id,
        a.name      AS agent_name,
        a.phone     AS agent_phone,
        a.agency_name
      FROM properties p
      LEFT JOIN agents a ON a.id = p.agent_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;

    const countParams = params.slice(0, params.length - 2);
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM properties p
      ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      query(dataQuery, params),
      query(countQuery, countParams),
    ]);

    const total = parseInt((countResult.rows[0] as { total: string }).total);

    res.json({
      data: dataResult.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    console.error("GET /listings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      res.status(400).json({ error: "Invalid listing ID" });
      return;
    }

    const internalNotesField = req.isAdmin
      ? "p.internal_notes"
      : "NULL AS internal_notes";

    const result = await query(
      `SELECT
         p.*,
         ${internalNotesField},
         a.id          AS agent_id,
         a.name        AS agent_name,
         a.email       AS agent_email,
         a.phone       AS agent_phone,
         a.agency_name AS agent_agency
       FROM properties p
       LEFT JOIN agents a ON a.id = p.agent_id
       WHERE p.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    const listing = result.rows[0] as Record<string, unknown>;
    if (!req.isAdmin) {
      delete listing.internal_notes;
    }

    res.json({ data: listing });
  } catch (err) {
    console.error("GET /listings/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
