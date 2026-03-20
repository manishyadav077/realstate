import { getListingById } from "@/src/lib/api";
import { Listing } from "@/src/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bed,
  Bath,
  Car,
  Ruler,
  MapPin,
  User,
  Phone,
  Mail,
  Building2,
  ArrowLeft,
  FileText,
} from "lucide-react";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(price: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function StatusBadge({ status }: { status: Listing["status"] }) {
  const config = {
    active: { label: "Active", bg: "#dcfce7", color: "#15803d" },
    under_offer: { label: "Under Offer", bg: "#fef9c3", color: "#a16207" },
    sold: { label: "Sold", bg: "#fee2e2", color: "#b91c1c" },
  };
  const { label, bg, color } = config[status];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "0.3rem 0.875rem",
        borderRadius: "999px",
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  let listing: Listing | null = null;

  try {
    const result = await getListingById(id);
    listing = result.data;
  } catch (err) {
    if (err instanceof Error && err.message === "Listing not found") notFound();
    throw err;
  }

  if (!listing) notFound();

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <Link
        href="/listings"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--brand-600)",
          textDecoration: "none",
          marginBottom: "1.5rem",
          transition: "gap 0.15s ease",
        }}
      >
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      <div
        className="hero-gradient"
        style={{
          borderRadius: "1.5rem 1.5rem 0 0",
          padding: "2.5rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <StatusBadge status={listing.status} />
          </div>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 0.75rem 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {listing.title}
          </h1>
          <p
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 900,
              color: "#93c5fd",
              margin: "0 0 0.75rem 0",
              letterSpacing: "-0.03em",
            }}
          >
            {formatPrice(listing.price)}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.875rem",
            }}
          >
            <MapPin size={14} />
            {listing.suburb}
            {listing.state ? `, ${listing.state}` : ""} {listing.postcode || ""}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 1.5rem 1.5rem",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "1px",
            background: "var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {[
            listing.beds > 0 && {
              icon: <Bed size={22} color="#2563eb" />,
              value: listing.beds,
              label: "Bedrooms",
            },
            listing.baths > 0 && {
              icon: <Bath size={22} color="#2563eb" />,
              value: listing.baths,
              label: "Bathrooms",
            },
            listing.car_spaces > 0 && {
              icon: <Car size={22} color="#2563eb" />,
              value: listing.car_spaces,
              label: "Car Spaces",
            },
            listing.land_size_sqm && {
              icon: <Ruler size={22} color="#2563eb" />,
              value: `${listing.land_size_sqm}m²`,
              label: "Land Size",
            },
          ]
            .filter(Boolean)
            .map((spec, i) => {
              const s = spec as {
                icon: React.ReactNode;
                value: string | number;
                label: string;
              };
              return (
                <div
                  key={i}
                  style={{
                    background: "var(--surface)",
                    padding: "1.25rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {s.icon}
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
        </div>

        <div
          style={{
            padding: "1rem 1.75rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Building2 size={15} color="var(--text-muted)" />
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "capitalize",
            }}
          >
            {listing.property_type}
          </span>
        </div>

        <div style={{ padding: "1.75rem" }}>
          <h2
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              margin: "0 0 0.875rem 0",
            }}
          >
            About This Property
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {listing.description ?? "No description available."}
          </p>
        </div>

        {listing.internal_notes && (
          <div
            style={{
              margin: "0 1.75rem 1.75rem",
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
              borderRadius: "1rem",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.625rem",
              }}
            >
              <FileText size={15} color="#92400e" />
              <h3
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#92400e",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: 0,
                }}
              >
                Internal Notes (Admin Only)
              </h3>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#78350f",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {listing.internal_notes}
            </p>
          </div>
        )}

        {listing.agent_name && (
          <div
            style={{
              padding: "1.5rem 1.75rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <h2
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 1rem 0",
              }}
            >
              Listed By
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#2563eb",
                }}
              >
                {listing.agent_name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    margin: "0 0 0.2rem 0",
                  }}
                >
                  {listing.agent_name}
                </p>
                {listing.agent_agency && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    {listing.agent_agency}
                  </p>
                )}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {listing.agent_phone && (
                    <a
                      href={`tel:${listing.agent_phone}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.82rem",
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      <Phone size={13} />
                      {listing.agent_phone}
                    </a>
                  )}
                  {listing.agent_email && (
                    <a
                      href={`mailto:${listing.agent_email}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      <Mail size={13} />
                      {listing.agent_email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
