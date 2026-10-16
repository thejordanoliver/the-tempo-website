import { useEffect, useSyncExternalStore } from "react";
import { Link, goBack, navigate, useRoute } from "./router.jsx";
import { sessionStore } from "./session.js";
import { Footer } from "./components.jsx";
import Landing from "./pages/Landing.jsx";
import Support from "./pages/Support.jsx";
import Privacy from "./pages/Privacy.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Game from "./pages/Game.jsx";
import Article from "./pages/Article.jsx";
export default function App() {
  const route = useRoute(),
    session = useSyncExternalStore(
      sessionStore.subscribe,
      sessionStore.getSnapshot,
    ),
    protectedPage = ["/home", "/profile"].includes(route.path);
  useEffect(() => {
    if (!session && protectedPage) navigate("/login/", { replace: true });
    else if (session && route.path === "/login")
      navigate("/home/", { replace: true });
  }, [session, route.path, protectedPage]);
  useEffect(() => {
    const title =
      {
        "/": "Your game. Your Tempo.",
        "/home": "Home",
        "/profile": "Your Profile",
        "/login": "Sign In",
        "/support": "Help & Support",
        "/privacy": "Privacy Policy",
        "/game": "Game",
        "/article": "Article",
      }[route.path] || "Page not found";
    document.title = title + " | Tempo Sports";
    let robots = document.querySelector('meta[name="robots"]');
    if (route.path === "/privacy") {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.append(robots);
      }
      robots.content = "noindex";
    } else robots?.remove();
    requestAnimationFrame(() => {
      if (route.hash) {
        document.getElementById(route.hash.slice(1))?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
        const heading = document.querySelector("main h1");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      }
    });
  }, [route.path, route.search, route.hash]);
  function logout() {
    void sessionStore.logout();
    navigate("/login/", { replace: true });
  }
  let page;
  switch (route.path) {
    case "/":
      page = <Landing />;
      break;
    case "/support":
      page = <Support />;
      break;
    case "/privacy":
      page = <Privacy />;
      break;
    case "/login":
      page = <Login />;
      break;
    case "/home":
      page = session ? <Home user={session.user} onLogout={logout} /> : null;
      break;
    case "/profile":
      page = session ? <Profile user={session.user} onLogout={logout} /> : null;
      break;
    case "/game":
      page = <Game search={route.search} />;
      break;
    case "/article":
      page = <Article search={route.search} />;
      break;
    default:
      page = (
        <article className="tempo-info">
          <h1>Page not found</h1>
          <Link to={session ? "/home/" : "/"}>Back to Tempo</Link>
        </article>
      );
  }
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <nav aria-label="Main navigation">
        {["/game", "/article"].includes(route.path) ? (
          <button
            className="navbar-back"
            type="button"
            onClick={() => goBack(session ? "/home/" : "/")}
            aria-label="Go back"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back</span>
          </button>
        ) : (
          <Link to="/" aria-label="Tempo home">
            TEMPO
          </Link>
        )}
        <div className="nav-links">
          {session && (
            <Link
              to="/home/"
              aria-current={route.path === "/home" ? "page" : undefined}
            >
              Home
            </Link>
          )}
          <Link
            to="/support/"
            aria-current={route.path === "/support" ? "page" : undefined}
          >
            Support
          </Link>
          {session ? (
            <Link
              to="/profile/"
              aria-current={route.path === "/profile" ? "page" : undefined}
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/login/"
              aria-current={route.path === "/login" ? "page" : undefined}
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
      <main id="content">{page}</main>
      <Footer />
    </>
  );
}
