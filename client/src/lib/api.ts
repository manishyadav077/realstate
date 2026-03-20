import { ListingDetailResponse, ListingsResponse, SearchFilters } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getListings(
  params: SearchFilters = {},
  isAdmin: boolean = false,
): Promise<ListingsResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  ) as Record<string, string>;

  const queryString = new URLSearchParams(cleanParams).toString();
  const url = `${API_BASE}/listings${queryString ? `?${queryString}` : ""}`;

  const headers: HeadersInit = {};
  if (isAdmin) headers["x-role"] = "admin";

  const res = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch listings: ${res.status}`);
  }

  return res.json() as Promise<ListingsResponse>;
}

export async function getListingById(
  id: string | number,
  isAdmin: boolean = false
): Promise<ListingDetailResponse> {
  const headers: HeadersInit = {};
  if (isAdmin) headers['x-role'] = 'admin';

  const res = await fetch(`${API_BASE}/listings/${id}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error('Listing not found');
    throw new Error(`Failed to fetch listing: ${res.status}`);
  }

  return res.json() as Promise<ListingDetailResponse>;
}