# PropSearch is a Real Estate Listing Platform

A complete real-estate listing search module with a high-performance backend (Node.js/PostgreSQL) and a premium frontend (Next.js).

## Getting Started

### Prerequisites

- **Node.js**: v18+
- **PostgreSQL**: Running instance

### Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd realstate
    ```

2.  **Server Setup**:
    ```bash
    cd server
    npm install
    # Copy .env.example to .env and configure your DB details
    cp .env.example .env
    ```

3.  **Client Setup**:
    ```bash
    cd ../client
    npm install
    # Copy .env.example to .env
    cp .env.example .env
    ```

### Running the Application

In two separate terminals:

- **Server**: `cd server && npm run dev`
- **Client**: `cd client && npm run dev`

---

## Project Structure

- `client/`: Next.js frontend with Tailwind CSS v4.
- `server/`: Express backend with TypeScript and direct PostgreSQL integration.
- `server/src/db/schema.sql`: Database schema definition and indexing.
- `server/src/tests/`: Integration tests using Jest and Supertest.

---

## Database Management

### 1. Initialize & Seed
To set up the database schema and populate it with mock properties and agents:
```bash
cd server
npm run seed
```

### 2. Indexes
The following indexes are implemented for high-performance search:
- `idx_properties_price`: Fast price range filtering.
- `idx_properties_subrub`: Efficient suburb search.
- `idx_properties_fulltext`: GIN Index for rapid keyword searches across titles/descriptions.
- `idx_properties_suburb_price`: Composite index for common search patterns.

---

## API Documentation

### GET `/listings`
Search and filter property listings.

**Query Parameters**:
- `price_min` / `price_max`: Price range limits.
- `beds` / `baths`: Minimum bedroom/bathroom count.
- `property_type`: Filter by `house`, `apartment`, `townhouse`.
- `suburb`: Case-insensitive partial matching.
- `keyword`: Full-text search string.
- `page` / `limit`: Pagination controls.

**Example Request**:
`GET /listings?suburb=Richmond&price_min=500000&beds=2`

### GET `/listings/:id`
Retrieve full details for a single property.

---

## Admin Roles

The system implements role-aware behavior:
- **Normal Users**: See public listing data only.
- **Admins**: If the request includes `x-role: admin`, the response includes sensitive `internal_notes`.

---

## Testing

The backend includes 14+ integration tests covering validation, filtering, pagination, and role-based access.
```bash
cd server
npm test
```
