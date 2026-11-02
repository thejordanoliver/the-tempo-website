import NavLinks from "./components/NavLinks.jsx";
import GuestHome from "./pages/GuestHome.jsx";
import Team from "./pages/Team.jsx";
import Icon from "./components/Icon.jsx";
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
import Leagues from "./pages/Leagues.jsx";
import League from "./pages/League.jsx";
import { favoriteLeagues } from "./favoriteLeagues.js";
import { hasLeague } from "./leagues.js";
export default function App() {
  const route = useRoute(),
    session = useSyncExternalStore(
      sessionStore.subscribe,
      sessionStore.getSnapshot,
    ),
    protectedPage = route.path === "/profile";
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
        "/leagues": "Leagues",
        "/team": "Team",
        "/league": hasLeague(new URLSearchParams(route.search).get("league"))
          ? favoriteLeagues[new URLSearchParams(route.search).get("league")]
              .label
          : "League",
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
    if (
      ["/league", "/team"].includes(route.path) &&
      document.activeElement?.closest(".league-detail")
    )
      return;
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
    navigate("/home/", { replace: true });
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
      page = session ? (
        <Home user={session.user} onLogout={logout} />
      ) : (
        <GuestHome />
      );
      break;
    case "/profile":
      page = session ? <Profile user={session.user} onLogout={logout} /> : null;
      break;
    case "/game":
      page = <Game search={route.search} />;
      break;
    case "/team":
      page = <Team search={route.search} signedIn={Boolean(session)} />;
      break;
    case "/leagues":
      page = <Leagues />;
      break;
    case "/league":
      page = <League search={route.search} signedIn={Boolean(session)} />;
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
        {["/game", "/article", "/league", "/team"].includes(route.path) ? (
          <button
            className="navbar-back"
            type="button"
            onClick={() => goBack(session ? "/home/" : "/")}
            aria-label="Go back"
          >
            <Icon name="chevron-back" />
            <span>Back</span>
          </button>
        ) : (
          <Link to="/" aria-label="Tempo home">
            TEMPO
          </Link>
        )}
        <NavLinks activeKey={`${route.path}:${Boolean(session)}`}>
          <Link
            to="/leagues/"
            aria-current={
              ["/leagues", "/league"].includes(route.path) ? "page" : undefined
            }
          >
            Leagues
          </Link>
          <Link
            to="/home/"
            aria-current={route.path === "/home" ? "page" : undefined}
          >
            Home
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
        </NavLinks>
      </nav>
      <main id="content">{page}</main>
      <Footer />
    </>
  );
}
