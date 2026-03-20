CREATE TABLE IF NOT EXISTS agents(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    agency_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()

)

CREATE TABLE IF NOT EXISTS properties(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,

    suburb VARCHAR(100) NOT NULL,
    state VARCHAR(50),
    postcode VARCHAR(10),
    property_type VARCHAR(50) NOT NULL,
    beds INTEGER NOT NULL DEFAULT 0,
    baths INTEGER NOT NULL DEFAULT 0,
    car_spaces INTEGER DEFAULT 0,
    land_size_sqm NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'active'

    internal_notes TEXT,
    agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()


)

CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

CREATE INDEX IF NOT EXISTS idx_properties_subrub ON properties(subrub text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

CREATE INDEX IF NOT EXISTS idx_properties_suburb_price ON properties(suburb, price);

CREATE INDEX IF NOT EXISTS idx_properties_fulltext ON properties USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURN TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();