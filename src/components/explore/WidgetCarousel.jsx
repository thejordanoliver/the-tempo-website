import { useEffect, useState } from "react";

export default function WidgetCarousel({
  items,
  renderItem,
  autoPlay = true,
  disabled = false,
  label,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const active = count ? index % count : 0;
  useEffect(() => {
    if (
      !autoPlay ||
      disabled ||
      paused ||
      count < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        setIndex((value) => (value + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, disabled, paused, count, index]);
  if (!count) return null;
  return (
    <section
      className="widget-carousel"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      onKeyDown={(event) => {
        if (disabled || !["ArrowLeft", "ArrowRight"].includes(event.key))
          return;
        event.preventDefault();
        setIndex(
          (active + (event.key === "ArrowLeft" ? -1 : 1) + count) % count,
        );
      }}
    >
      <div
        className="widget-slide"
        role="group"
        aria-roledescription="slide"
        aria-label={`${active + 1} of ${count}`}
        inert={disabled ? true : undefined}
      >
        {renderItem(items[active])}
      </div>
      {count > 1 && (
        <div className="widget-slide-controls">
          <button
            type="button"
            disabled={disabled}
            aria-label={`Previous ${label} slide`}
            onClick={() => setIndex((active - 1 + count) % count)}
          >
            ‹
          </button>
          <span aria-live={paused ? "polite" : "off"}>
            {active + 1} / {count}
          </span>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Next ${label} slide`}
            onClick={() => setIndex((active + 1) % count)}
          >
            ›
          </button>
          {autoPlay && (
            <button
              type="button"
              disabled={disabled}
              aria-label={paused ? "Play slides" : "Pause slides"}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
