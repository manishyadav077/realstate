import { pool } from "./index";
import "dotenv/config";
import { PoolClient } from "pg";

interface Agent {
  name: string;
  email: string;
  phone: string;
  agency: string;
}

interface Property {
  title: string;
  description: string;
  price: number;
  suburb: string;
  state: string;
  postcode: string;
  type: string;
  beds: number;
  baths: number;
  cars: number;
  land: number | null;
  status: string;
  notes: string | null;
}

const agents: Agent[] = [
  {
    name: "Sarah Mitchell",
    email: "sarah@apexrealty.com",
    phone: "0412 111 222",
    agency: "Apex Realty",
  },
  {
    name: "James Thornton",
    email: "james@harborprop.com",
    phone: "0413 333 444",
    agency: "Harbor Properties",
  },
  {
    name: "Priya Nair",
    email: "priya@cityliving.com",
    phone: "0414 555 666",
    agency: "City Living Group",
  },
  {
    name: "David Okonkwo",
    email: "david@northsidere.com",
    phone: "0415 777 888",
    agency: "Northside Real Estate",
  },
];

const properties: Property[] = [
  {
    title: "Stunning Riverside Family Home",
    description:
      "A beautifully renovated 4-bedroom home on a large corner block. Features open-plan living, updated kitchen, and a large deck overlooking the backyard.",
    price: 920000,
    suburb: "Northside",
    state: "QLD",
    postcode: "4000",
    type: "house",
    beds: 4,
    baths: 2,
    cars: 2,
    land: 650,
    status: "active",
    notes: "Vendor motivated had offer fall through at finance stage.",
  },
  {
    title: "Modern City Apartment with Views",
    description:
      "Sleek 2-bedroom apartment on level 18 with panoramic city views. Includes secure parking, gym, and rooftop terrace.",
    price: 620000,
    suburb: "CBD",
    state: "QLD",
    postcode: "4001",
    type: "apartment",
    beds: 2,
    baths: 1,
    cars: 1,
    land: null,
    status: "active",
    notes: "Body corporate fees are higher than average.",
  },
  {
    title: "Charming Cottage in Quiet Street",
    description:
      "Original 1950s cottage with loads of character. 3 bedrooms, polished hardwood floors, wide front porch.",
    price: 540000,
    suburb: "Northside",
    state: "QLD",
    postcode: "4000",
    type: "house",
    beds: 3,
    baths: 1,
    cars: 1,
    land: 420,
    status: "active",
    notes: "Heritage overlay check with council before any major reno.",
  },
  {
    title: "Spacious Townhouse Near Train Station",
    description:
      "End-of-terrace townhouse with 3 bedrooms over two levels. Private courtyard, single lock-up garage.",
    price: 710000,
    suburb: "Westfield",
    state: "QLD",
    postcode: "4101",
    type: "townhouse",
    beds: 3,
    baths: 2,
    cars: 1,
    land: 180,
    status: "active",
    notes: null,
  },
  {
    title: "Luxury Penthouse Harbour Views",
    description:
      "Rare full-floor penthouse with 360-degree harbour views. 3 bedrooms with ensuites, chef kitchen, private rooftop.",
    price: 2450000,
    suburb: "CBD",
    state: "QLD",
    postcode: "4001",
    type: "apartment",
    beds: 3,
    baths: 3,
    cars: 2,
    land: null,
    status: "active",
    notes: "VIP client listing do not publish price publicly without approval.",
  },
  {
    title: "Investor Special Tenanted Unit",
    description:
      "Well-maintained 1-bedroom unit currently tenanted at $420/week. Solid rental yield in high-demand suburb.",
    price: 385000,
    suburb: "Southbank",
    state: "QLD",
    postcode: "4102",
    type: "apartment",
    beds: 1,
    baths: 1,
    cars: 1,
    land: null,
    status: "active",
    notes: "Tenant lease expires in 4 months.",
  },
  {
    title: "Large Acreage Block Build Your Dream Home",
    description:
      "2.3 hectare block in semi-rural setting, fully fenced with power and water connected.",
    price: 480000,
    suburb: "Greenfields",
    state: "QLD",
    postcode: "4300",
    type: "land",
    beds: 0,
    baths: 0,
    cars: 0,
    land: 23000,
    status: "active",
    notes: "Soil report shows reactive clay.",
  },
  {
    title: "Under Offer Contemporary 4-Bed",
    description:
      "Architecturally designed home with north-facing pool and outdoor entertaining.",
    price: 1150000,
    suburb: "Eastside",
    state: "QLD",
    postcode: "4169",
    type: "house",
    beds: 4,
    baths: 3,
    cars: 2,
    land: 510,
    status: "under_offer",
    notes: "Finance approved. Settlement in 3 weeks.",
  },
  {
    title: "Affordable First Home in Growing Suburb",
    description:
      "Neat 3-bedroom home in one of the fastest-growing suburbs. New kitchen and bathroom. Large yard with shed.",
    price: 495000,
    suburb: "Northside",
    state: "QLD",
    postcode: "4000",
    type: "house",
    beds: 3,
    baths: 1,
    cars: 2,
    land: 500,
    status: "active",
    notes: null,
  },
  {
    title: "Boutique Apartment Lifestyle Location",
    description:
      "One of only 8 apartments in a boutique complex. High ceilings, stone benchtops, walk-in robe.",
    price: 567000,
    suburb: "Southbank",
    state: "QLD",
    postcode: "4102",
    type: "apartment",
    beds: 2,
    baths: 1,
    cars: 1,
    land: null,
    status: "active",
    notes: null,
  },
  {
    title: "Grand Queenslander Character and Charm",
    description:
      "Iconic highset Queenslander with wrap-around verandahs, VJ walls, and leadlight windows. 5 bedrooms, pool.",
    price: 1380000,
    suburb: "Eastside",
    state: "QLD",
    postcode: "4169",
    type: "house",
    beds: 5,
    baths: 3,
    cars: 2,
    land: 810,
    status: "active",
    notes: "Listed exclusively previously with competitor for 90 days.",
  },
  {
    title: "Studio Apartment Perfect for Students",
    description:
      "Compact and efficient studio on level 3. Built-in desk, Murphy bed, small kitchen. Walking distance to university.",
    price: 215000,
    suburb: "CBD",
    state: "QLD",
    postcode: "4001",
    type: "apartment",
    beds: 0,
    baths: 1,
    cars: 0,
    land: null,
    status: "active",
    notes: "Short-term rental potential check council zoning first.",
  },
];

async function createTables(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS agents (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      email       VARCHAR(150) UNIQUE NOT NULL,
      phone       VARCHAR(20),
      agency_name VARCHAR(150),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id              SERIAL PRIMARY KEY,
      title           VARCHAR(255) NOT NULL,
      description     TEXT,
      price           NUMERIC(12, 2) NOT NULL,
      suburb          VARCHAR(100) NOT NULL,
      state           VARCHAR(50),
      postcode        VARCHAR(10),
      property_type   VARCHAR(50) NOT NULL,
      beds            INTEGER NOT NULL DEFAULT 0,
      baths           INTEGER NOT NULL DEFAULT 0,
      car_spaces      INTEGER DEFAULT 0,
      land_size_sqm   NUMERIC(10, 2),
      status          VARCHAR(50) DEFAULT 'active',
      internal_notes  TEXT,
      agent_id        INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_price
    ON properties(price)
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_suburb
    ON properties(suburb)
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_type
    ON properties(property_type)
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_status
    ON properties(status)
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_suburb_price
    ON properties(suburb, price)
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_properties_fulltext
    ON properties
    USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')))
  `);
}

async function seed(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log("Creating tables...");
    await createTables(client);
    console.log("Tables and indexes created");

    await client.query("DELETE FROM properties");
    await client.query("DELETE FROM agents");
    await client.query("ALTER SEQUENCE properties_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE agents_id_seq RESTART WITH 1");
    console.log("Existing data cleared");

    const agentIds: number[] = [];
    for (const a of agents) {
      const res = await client.query<{ id: number }>(
        `INSERT INTO agents (name, email, phone, agency_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [a.name, a.email, a.phone, a.agency],
      );
      agentIds.push(res.rows[0].id);
    }
    console.log(`Seeded ${agentIds.length} agents`);

    for (let i = 0; i < properties.length; i++) {
      const p = properties[i];
      const agentId = agentIds[i % agentIds.length];

      await client.query(
        `INSERT INTO properties
           (title, description, price, suburb, state, postcode,
            property_type, beds, baths, car_spaces, land_size_sqm,
            status, internal_notes, agent_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          p.title,
          p.description,
          p.price,
          p.suburb,
          p.state,
          p.postcode,
          p.type,
          p.beds,
          p.baths,
          p.cars,
          p.land,
          p.status,
          p.notes,
          agentId,
        ],
      );
    }
    console.log(`Seeded ${properties.length} properties`);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Seed failed: ", (error as Error).message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
