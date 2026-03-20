"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useTransition } from "react";
import { Search, X, SlidersHorizontal, RotateCcw, Loader2 } from "lucide-react";
import type { SearchFilters as SearchFiltersType } from "../types/index";
import { useDebounce } from "../hooks/debounce";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFiltersType>({
    suburb: searchParams.get("suburb") || "",
    price_min: searchParams.get("price_min") || "",
    price_max: searchParams.get("price_max") || "",
    beds: searchParams.get("beds") || "",
    baths: searchParams.get("baths") || "",
    property_type:
      (searchParams.get(
        "property_type",
      ) as SearchFiltersType["property_type"]) || "",
  });

  const [isPending, startTransition] = useTransition();
  const debouncedFilters = useDebounce(filters, 600);
  const isInitialMount = useRef(true);


  useEffect(() => {
  
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    startTransition(() => {
      params.set("page", "1");
      router.push(`/listings?${params.toString()}`);
    });
  }, [debouncedFilters, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({
      suburb: "",
      price_min: "",
      price_max: "",
      beds: "",
      baths: "",
      property_type: "",
    });
    router.push("/listings");
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div
      className="card animate-fade-in-up"
      style={{ padding: "1.75rem", marginBottom: "1.75rem" }}
    >
   
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SlidersHorizontal size={18} color="#2563eb" />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Search Properties
          </h2>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Filter by any combination of criteria
          </p>
        </div>
        {isPending ? (
          <span
            className="badge"
            style={{
              marginLeft: "auto",
              background: "var(--brand-50)",
              color: "var(--brand-600)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Loader2 size={12} className="animate-spin" />
            Updating...
          </span>
        ) : (
          hasActiveFilters && (
            <span
              className="badge"
              style={{
                marginLeft: "auto",
                background: "#dbeafe",
                color: "#1d4ed8",
              }}
            >
              Filters active
            </span>
          )
        )}
      </div>

   
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
      
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Suburb
          </label>
          <input
            type="text"
            name="suburb"
            value={filters.suburb}
            onChange={handleChange}
            placeholder="e.g. Northside"
            className="input-field"
          />
        </div>

        
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Property Type
          </label>
          <select
            name="property_type"
            value={filters.property_type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Any Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
          </select>
        </div>

     
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Min Price ($)
          </label>
          <input
            type="number"
            name="price_min"
            value={filters.price_min}
            onChange={handleChange}
            placeholder="Min Price"
            min="0"
            className="input-field"
          />
        </div>

     
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Max Price ($)
          </label>
          <input
            type="number"
            name="price_max"
            value={filters.price_max}
            onChange={handleChange}
            placeholder="Max Price"
            min="0"
            className="input-field"
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Min Beds
          </label>
          <select
            name="beds"
            value={filters.beds}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

      
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Min Baths
          </label>
          <select
            name="baths"
            value={filters.baths}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>
      </div>

    
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="stagger-1"
          style={{
            marginTop: "1.25rem",
            background: "none",
            border: "none",
            color: "var(--brand-600)",
            fontSize: "0.8rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <RotateCcw size={14} />
          Reset all filters
        </button>
      )}
    </div>
  );
}
