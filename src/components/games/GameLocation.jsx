import { safeURL } from "../../utils/urls.js";
import HeadingTwo from "../ui/HeadingTwo.jsx";
import Icon from "../ui/Icon.jsx";
import { Image } from "../ui/Image.jsx";
import "./GameLocation.css";
export default function GameLocation({
  details = {},
  title = "Game Location",
  className = "",
}) {
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
    <section className={`detail-section ${className}`}>
      <HeadingTwo>{title}</HeadingTwo>
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
            <Icon name="location" size={26} />
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
            <Icon name="open" className="icon-after" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
