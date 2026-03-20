export interface Agent{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    agency_name: string | null;
    created_at: string
}

export interface Listing{
    id: number;
    title: string;
    description: string | null;
    price: string;
    suburb: string;
    state: string | null;
    postcode: string | null;
    property_type: 'house' | 'apartment' | 'townhouse' | 'land';
    beds: number;
    baths: number;
    car_spaces: number;
    land_size_sqm: string | null;
    status: 'active' | 'under_offer' | 'sold';
    internal_notes: string | null;
    created_at: string;
    updated_at: string;

    agent_id: number | null;
    agent_name: string | null
    agent_phone: string | null
    agent_email: string | null
    agent_agency: string | null
    agency_name: string | null
}

export interface ListingSummary {
  id: number;
  title: string;
  price: string;
  suburb: string;
  state: string | null;
  postcode: string | null;
  property_type: 'house' | 'apartment' | 'townhouse' | 'land';
  beds: number;
  baths: number;
  car_spaces: number;
  land_size_sqm: string | null;
  status: 'active' | 'under_offer' | 'sold';
  created_at: string;
  agent_id: number | null;
  agent_name: string | null;
  agent_phone: string | null;
  agency_name: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListingsResponse {
  data: ListingSummary[];
  pagination: Pagination;
}

export interface ListingDetailResponse {
  data: Listing;
}


export interface SearchFilters {
  suburb?: string;
  price_min?: string;
  price_max?: string;
  beds?: string;
  baths?: string;
  property_type?: 'house' | 'apartment' | 'townhouse' | 'land' | '';
  keyword?: string;
  status?: 'active' | 'under_offer' | 'sold';
  page?: string;
  limit?: string;
}

