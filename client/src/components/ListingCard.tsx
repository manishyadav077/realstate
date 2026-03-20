import Link from "next/link";
import { Bed, Bath, Car, Ruler, MapPin, User } from "lucide-react";
import type { ListingSummary } from "../types/index";

function formatPrice(price: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(Number(price));
}


interface StatusBadgeProps {
  status: ListingSummary["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<
    ListingSummary["status"],
    { label: string; bg: string; color: string }
  > = {
    active: { label: "Active", bg: "#dcfce7", color: "#15803d" },
    under_offer: { label: "Under Offer", bg: "#fef9c3", color: "#a16207" },
    sold: { label: "Sold", bg: "#fee2e2", color: "#b91c1c" },
  };
  const { label, bg, color } = config[status];
  return (
    <span className="badge" style={{ background: bg, color, flexShrink: 0 }}>
      {label}
    </span>
  );
}


function typeLabel(type: ListingSummary["property_type"]): string {
  return (
    {
      house: "House",
      apartment: "Apartment",
      townhouse: "Townhouse",
      land: "Land",
    }[type] ?? type
  );
}


interface ListingCardProps {
  listing: ListingSummary;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="card"
        style={{
          padding: "1.4rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
     
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.35,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {listing.title}
          </h3>
          <StatusBadge status={listing.status} />
        </div>

     
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            margin: "0 0 0.6rem 0",
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {formatPrice(listing.price)}
        </p>

      
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            marginBottom: "0.9rem",
          }}
        >
          <MapPin size={13} />
          <span>
            {listing.suburb}
            {listing.state ? `, ${listing.state}` : ""} {listing.postcode || ""}
          </span>
        </div>

       
        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            flexWrap: "wrap",
            padding: "0.7rem 0.875rem",
            background: "var(--surface-3)",
            borderRadius: "0.625rem",
            marginBottom: "0.9rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {listing.beds > 0 && (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Bed size={14} color="#3b82f6" />
              {listing.beds} bed{listing.beds !== 1 ? "s" : ""}
            </span>
          )}
          {listing.baths > 0 && (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Bath size={14} color="#3b82f6" />
              {listing.baths} bath{listing.baths !== 1 ? "s" : ""}
            </span>
          )}
          {listing.car_spaces > 0 && (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Car size={14} color="#3b82f6" />
              {listing.car_spaces}
            </span>
          )}
          {listing.land_size_sqm && (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Ruler size={14} color="#3b82f6" />
              {listing.land_size_sqm}m²
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              background: "#f1f5f9",
              padding: "0.25rem 0.65rem",
              borderRadius: "999px",
            }}
          >
            {typeLabel(listing.property_type)}
          </span>
          {listing.agent_name && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <User size={12} />
              {listing.agent_name}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
