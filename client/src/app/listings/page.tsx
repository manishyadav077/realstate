import ListingCard from "@/src/components/ListingCard";
import Pagination from "@/src/components/Pagination";
import SearchFilters from "@/src/components/SearchFilter";
import { getListings } from "@/src/lib/api";
import {
  ListingsResponse,
  SearchFilters as SearchFiltersType,
} from "@/src/types";
import { Suspense } from "react";
import { Building2 } from "lucide-react";

interface ListingsPageProps {
  searchParams: Promise<{
    suburb?: string;
    price_min?: string;
    price_max?: string;
    beds?: string;
    baths?: string;
    property_type?: string;
    keyword?: string;
    page?: string;
  }>;
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const resolvedParams = await searchParams;

  const params: SearchFiltersType = {
    suburb: resolvedParams.suburb || "",
    price_min: resolvedParams.price_min || "",
    price_max: resolvedParams.price_max || "",
    beds: resolvedParams.beds || "",
    baths: resolvedParams.baths || "",
    property_type:
      (resolvedParams.property_type as SearchFiltersType["property_type"]) ||
      "",
    keyword: resolvedParams.keyword || "",
    page: resolvedParams.page || "1",
    limit: "9",
  };

  let result: ListingsResponse | null = null;
  let error: string | null = null;

  try {
    result = await getListings(params);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        className="hero-gradient animate-fade-in-up"
        style={{
          borderRadius: "1.5rem",
          padding: "3rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-20px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "999px",
              padding: "0.3rem 1rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              marginBottom: "1rem",
            }}
          >
            <Building2 size={13} />
            Real Estate Platform
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 0.75rem 0",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Find Your Perfect Property
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              maxWidth: "480px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Search thousands of listings — filter by suburb, price, type, and
            more.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        <aside className="w-full md:w-[280px] md:sticky md:top-[90px] shrink-0">
          <Suspense fallback={<div className="skeleton h-[500px]" />}>
            <SearchFilters />
          </Suspense>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-baseline mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-extrabold m-0">
                Available Properties
              </h2>
              <p className="text-sm text-gray-500 m-0">
                Explore properties matching your criteria
              </p>
            </div>
            {result && (
              <p className="text-sm text-gray-500 m-0">
                Showing{" "}
                <span className="text-gray-900 font-semibold">
                  {result.pagination.total}
                </span>{" "}
                listings
              </p>
            )}
          </div>

          {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-800">
              {error}
            </div>
          )}

          {result && (
            <>
              {result.data.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-400">
                    No properties match your current filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.data.map((listing, i) => (
                    <div
                      key={listing.id}
                      className={`animate-fade-in-up stagger-${Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}`}
                    >
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              )}

              <Suspense fallback={null}>
                <Pagination pagination={result.pagination} />
              </Suspense>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
