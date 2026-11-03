import { useEffect, useRef, useState } from "react";

import { Link } from "../../app/router.jsx";
import Icon from "../ui/Icon.jsx";
import ThemeSelector from "../ui/ThemeSelector.jsx";

export default function MobileNavigation({ signedIn, path, routeKey }) {
  const dialog = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    dialog.current?.close();
  }, [routeKey]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    const resize = () => {
      if (!media.matches) dialog.current?.close();
    };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const links = [
    ["/home/", "Home", path === "/home"],
    ["/explore/", "Explore", path === "/explore"],
    ["/leagues/", "Leagues", ["/league", "/leagues"].includes(path)],
    signedIn
      ? ["/profile/", "Profile", path === "/profile"]
      : ["/login/", "Sign in", path === "/login"],
    ["/support/", "Help & support", path === "/support"],
  ];
  return (
    <>
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Open navigation menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => {
          dialog.current.showModal();
          setOpen(true);
        }}
      >
        <Icon name="menu" size={26} />
      </button>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-sidebar"
        aria-labelledby="mobile-navigation-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== dialog.current) return;
          const rect = dialog.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dialog.current.close();
        }}
      >
        <div className="mobile-sidebar-heading">
          <strong id="mobile-navigation-title">TEMPO</strong>
          <button
            type="button"
            className="mobile-sidebar-close"
            aria-label="Close navigation menu"
            onClick={() => dialog.current.close()}
          >
            <Icon name="close" size={26} />
          </button>
        </div>
        <div
          className="mobile-sidebar-links"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {links.map(([to, label, active]) => (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              onClick={() => dialog.current.close()}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="mobile-sidebar-theme">
          <span>Appearance</span>
          <ThemeSelector />
        </div>
      </dialog>
    </>
  );
}
