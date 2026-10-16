import HeadingTwo from "./HeadingTwo.jsx";
import { Image, safeURL } from "../components.jsx";
import "./GameLocation.css";
export default function GameLocation({ details = {} }) {
  const venue = details.venueInfo || {},
    fallback = details.venue || {},
    address = venue.address || fallback.address || {},
    name = venue.name || fallback.fullName || fallback.name;
  const location = [address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");
  const formatted =
    address.formatted ||
    [address.street, location, address.postalCode || address.zipCode]
      .filter(Boolean)
      .join(", ");
  const image = safeURL(venue.image || fallback.images?.[0]?.href),
    capacity = venue.capacity ?? fallback.capacity,
    attendance = details.attendance,
    grass = venue.grass ?? fallback.grass;
  if (!name && !formatted) return null;
  const count = (value) =>
    typeof value === "number" && Number.isFinite(value) && value > 0
      ? value.toLocaleString()
      : null;
  const rows = [
    ["Capacity", count(capacity)],
    ["Attendance", count(attendance)],
    [
      "Surface",
      typeof grass === "boolean"
        ? grass
          ? "Natural grass"
          : "Artificial turf"
        : null,
    ],
    [
      "Venue",
      typeof venue.indoor === "boolean"
        ? venue.indoor
          ? "Indoor"
          : "Outdoor"
        : null,
    ],
  ].filter(([, value]) => value);
  const query = [name, formatted].filter(Boolean).join(", ");
  return (
    <section className="detail-section">
      <HeadingTwo>Game Location</HeadingTwo>
      <div className="game-panel game-location">
        {image && (
          <Image
            className="game-location-image"
            src={image}
            alt={name || "Game venue"}
            loading="lazy"
          />
        )}
        <div className="game-location-content">
          <div className="game-location-heading">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <h3>{name || "Game venue"}</h3>
              {formatted && <address>{formatted}</address>}
            </div>
          </div>
          {rows.length > 0 && (
            <dl className="game-location-details">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <a
            className="game-location-map"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Maps<span className="sr-only"> (opens in a new tab)</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
