import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import ThemeSource from "../ui/ThemeSource.jsx";
export function LeagueLogo({ league }) {
  const config = favoriteLeagues[league];
  return (
    <picture className="league-logo">
      <ThemeSource srcSet={config.logoDark} />
      <img src={config.logo} alt="" loading="lazy" />
    </picture>
  );
}
