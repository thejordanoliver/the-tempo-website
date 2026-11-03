import { useLayoutEffect, useRef, useState } from "react";
export default function NavLinks({ activeKey, children, className = "" }) {
  const ref = useRef(null),
    [indicator, setIndicator] = useState({ x: 0, width: 0, visible: false });
  useLayoutEffect(() => {
    const container = ref.current;
    let cancelled = false;
    function measure() {
      if (cancelled) return;
      const active = container.querySelector('a[aria-current="page"]');
      if (!active) {
        setIndicator((current) =>
          current.visible ? { ...current, visible: false } : current,
        );
        return;
      }
      const bounds = container.getBoundingClientRect(),
        link = active.getBoundingClientRect();
      const next = {
        x: link.left - bounds.left,
        width: link.width,
        visible: true,
      };
      setIndicator((current) =>
        current.x === next.x && current.width === next.width && current.visible
          ? current
          : next,
      );
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    for (const link of container.querySelectorAll("a")) observer.observe(link);
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeKey]);
  return (
    <div ref={ref} className={`nav-links ${className}`.trim()}>
      {children}
      <span
        aria-hidden="true"
        className="nav-underline"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.x}px)`,
          opacity: indicator.visible ? 1 : 0,
        }}
      />
    </div>
  );
}
