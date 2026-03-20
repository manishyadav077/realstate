import request from "supertest";
import app from "../../src/app";
import { pool } from "../../src/db";

afterAll(async () => {
  await pool.end();
});

describe("GET /listings", () => {
  test("returns 200 with data and pagination metadata", async () => {
    const res = await request(app).get("/listings");

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);

    const { pagination } = res.body;
    expect(pagination).toHaveProperty("total");
    expect(pagination).toHaveProperty("page");
    expect(pagination).toHaveProperty("limit");
    expect(pagination).toHaveProperty("totalPages");
    expect(pagination).toHaveProperty("hasNext");
    expect(pagination).toHaveProperty("hasPrev");
  });

  test("paginates correctly — page 1 and page 2 return different records", async () => {
    const page1 = await request(app).get("/listings?limit=2&page=1");
    const page2 = await request(app).get("/listings?limit=2&page=2");

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);

    const ids1 = page1.body.data.map((p: { id: number }) => p.id);
    const ids2 = page2.body.data.map((p: { id: number }) => p.id);

    const overlap = ids1.filter((id: number) => ids2.includes(id));
    expect(overlap).toHaveLength(0);

    expect(page1.body.pagination.page).toBe(1);
    expect(page1.body.pagination.hasPrev).toBe(false);
    expect(page1.body.pagination.hasNext).toBe(true);
  });

  test("price_max filter returns only listings within range", async () => {
    const res = await request(app).get("/listings?price_max=500000");

    expect(res.status).toBe(200);

    res.body.data.forEach((listing: { price: string | number }) => {
      expect(Number(listing.price)).toBeLessThanOrEqual(500000);
    });
  });

  test("price_min filter returns only listings above minimum", async () => {
    const res = await request(app).get("/listings?price_min=1000000");

    expect(res.status).toBe(200);
    res.body.data.forEach((listing: { price: string | number }) => {
      expect(Number(listing.price)).toBeGreaterThanOrEqual(1000000);
    });
  });

  test("price range filter — price_min and price_max together", async () => {
    const res = await request(app).get(
      "/listings?price_min=500000&price_max=800000",
    );

    expect(res.status).toBe(200);
    res.body.data.forEach((listing: { price: string | number }) => {
      const price = Number(listing.price);
      expect(price).toBeGreaterThanOrEqual(500000);
      expect(price).toBeLessThanOrEqual(800000);
    });
  });

  test("property_type filter returns only matching type", async () => {
    const res = await request(app).get("/listings?property_type=apartment");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);

    res.body.data.forEach((listing: { property_type: string }) => {
      expect(listing.property_type).toBe("apartment");
    });
  });

  test("suburb filter returns only matching suburb (case-insensitive)", async () => {
    const res = await request(app).get("/listings?suburb=northside");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);

    res.body.data.forEach((listing: { suburb: string }) => {
      expect(listing.suburb.toLowerCase()).toContain("northside");
    });
  });

  test("keyword filter returns results matching the search term", async () => {
    const res = await request(app).get("/listings?keyword=renovation");

    expect(res.status).toBe(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("returns 400 for invalid price_min", async () => {
    const res = await request(app).get("/listings?price_min=abc");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 400 when price_min > price_max", async () => {
    const res = await request(app).get(
      "/listings?price_min=900000&price_max=100000",
    );
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 400 for invalid property_type", async () => {
    const res = await request(app).get("/listings?property_type=castle");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /listings/:id", () => {
  test("returns 200 with full listing data for valid id", async () => {
    const res = await request(app).get("/listings/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    const listing = res.body.data;

    expect(listing).toHaveProperty("id");
    expect(listing).toHaveProperty("title");
    expect(listing).toHaveProperty("price");
    expect(listing).toHaveProperty("suburb");
    expect(listing).toHaveProperty("beds");
    expect(listing).toHaveProperty("baths");
    expect(listing).toHaveProperty("agent_name");
  });

  test("returns 404 for non-existent listing", async () => {
    const res = await request(app).get("/listings/999999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 400 for non-numeric id", async () => {
    const res = await request(app).get("/listings/abc");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("regular user does NOT receive internal_notes", async () => {
    const res = await request(app).get("/listings/1");

    expect(res.status).toBe(200);

    expect(res.body.data).not.toHaveProperty("internal_notes");
  });

  test("admin user DOES receive internal_notes field", async () => {
    const res = await request(app).get("/listings/1").set("x-role", "admin");

    expect(res.status).toBe(200);

    expect(res.body.data).toHaveProperty("internal_notes");
  });
});

describe("GET /health", () => {
  test("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
