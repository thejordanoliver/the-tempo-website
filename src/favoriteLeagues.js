import ATPLogo from "./league-logos/ATPLogo.png";
import BundesligaLogo from "./league-logos/BundesligaLogo.png";
import BundesligaLightLogo from "./league-logos/BundesligaLightLogo.png";
import CBLogo from "./league-logos/CBLogo.png";
import MCBBLogo from "./league-logos/MCBBLogo.png";
import CFBLogo from "./league-logos/CFBLogo.png";
import UEFAChampionsLogo from "./league-logos/UEFAChampionsLogo.png";
import UEFAChampionsLightLogo from "./league-logos/UEFAChampionsLightLogo.png";
import EPLLogo from "./league-logos/EPLLogo.png";
import UEFAEuropaLogo from "./league-logos/UEFAEuropaLogo.png";
import UEFAEuropaLightLogo from "./league-logos/UEFAEuropaLightLogo.png";
import F1Logo from "./league-logos/F1Logo.png";
import F1LogoLight from "./league-logos/F1LogoLight.png";
import WorldCupLogo from "./league-logos/WorldCupLogo.png";
import WorldCupLightLogo from "./league-logos/WorldCupLightLogo.png";
import GLeagueLogo from "./league-logos/GLeagueLogo.png";
import GLeagueLogoLight from "./league-logos/GLeagueLogoLight.png";
import LaLigaLogo from "./league-logos/LaLigaLogo.png";
import LaLigaLightLogo from "./league-logos/LaLigaLightLogo.png";
import LeaguesCupLogo from "./league-logos/LeaguesCupLogo.png";
import LeaguesCupLogoLight from "./league-logos/LeaguesCupLogoLight.png";
import Ligue1Logo from "./league-logos/Ligue1Logo.png";
import Ligue1LightLogo from "./league-logos/Ligue1LightLogo.png";
import Ligue2Logo from "./league-logos/Ligue2Logo.png";
import Ligue2LightLogo from "./league-logos/Ligue2LightLogo.png";
import MLBLogo from "./league-logos/MLBLogo.png";
import MLSLogo from "./league-logos/MLSLogo.png";
import MCSLogo from "./league-logos/MCSLogo.png";
import WCSLogo from "./league-logos/WCSLogo.png";
import NascarLogo from "./league-logos/NascarLogo.png";
import NascarLightLogo from "./league-logos/NascarLightLogo.png";
import NBALogo from "./league-logos/NBALogo.png";
import NFLLogo from "./league-logos/NFLLogo.png";
import NHLLogo from "./league-logos/NHLLogo.png";
import SBLogo from "./league-logos/SBLogo.png";
import UFCLogo from "./league-logos/UFCLogo.png";
import UFCLogoLight from "./league-logos/UFCLogoLight.png";
import UFLLogo from "./league-logos/UFLLogo.png";
import UFLLightLogo from "./league-logos/UFLLightLogo.png";
import WCBBLogo from "./league-logos/WCBBLogo.png";
import WNBALogo from "./league-logos/WNBALogo.png";
import WNBALogoLight from "./league-logos/WNBALogoLight.png";
import WTALogo from "./league-logos/WTALogo.png";
import WTALogoLight from "./league-logos/WTALogoLight.png";
export const favoriteLeagues = {
  atp: {
    label: "ATP Tennis",
    color: "#002865",
    logo: new URL(ATPLogo, import.meta.url).href,
    logoDark: new URL(ATPLogo, import.meta.url).href,
  },
  bundesliga: {
    label: "German Bundesliga",
    color: "#D20515",
    logo: new URL(BundesligaLogo, import.meta.url).href,
    logoDark: new URL(BundesligaLightLogo, import.meta.url).href,
  },
  cb: {
    label: "College Baseball",
    color: "#009CDE",
    logo: new URL(CBLogo, import.meta.url).href,
    logoDark: new URL(CBLogo, import.meta.url).href,
  },
  mcbb: {
    label: "M. College Basketball",
    color: "#009CDE",
    logo: new URL(MCBBLogo, import.meta.url).href,
    logoDark: new URL(MCBBLogo, import.meta.url).href,
  },
  cfb: {
    label: "College Football",
    color: "#009CDE",
    logo: new URL(CFBLogo, import.meta.url).href,
    logoDark: new URL(CFBLogo, import.meta.url).href,
  },
  champions: {
    label: "UEFA Champions League",
    color: "#0E1E5B",
    logo: new URL(UEFAChampionsLogo, import.meta.url).href,
    logoDark: new URL(UEFAChampionsLightLogo, import.meta.url).href,
  },
  epl: {
    label: "English Premier League",
    color: "#37003C",
    logo: new URL(EPLLogo, import.meta.url).href,
    logoDark: new URL(EPLLogo, import.meta.url).href,
  },
  europa: {
    label: "UEFA Europa League",
    color: "#F57C00",
    logo: new URL(UEFAEuropaLogo, import.meta.url).href,
    logoDark: new URL(UEFAEuropaLightLogo, import.meta.url).href,
  },
  f1: { label: "F1", color: "#E10600", logo: new URL(F1Logo, import.meta.url).href, logoDark: new URL(F1LogoLight, import.meta.url).href },
  fifa: {
    label: "FIFA World Cup",
    color: "#326295",
    logo: new URL(WorldCupLogo, import.meta.url).href,
    logoDark: new URL(WorldCupLightLogo, import.meta.url).href,
  },
  fifaw: {
    label: "FIFA Women's World Cup",
    color: "#A50064",
    logo: new URL(WorldCupLogo, import.meta.url).href,
    logoDark: new URL(WorldCupLightLogo, import.meta.url).href,
  },
  gleague: {
    label: "NBA G League",
    color: "#000000",
    logo: new URL(GLeagueLogo, import.meta.url).href,
    logoDark: new URL(GLeagueLogoLight, import.meta.url).href,
  },
  laliga: {
    label: "Spanish LALIGA",
    color: "#FF4B44",
    logo: new URL(LaLigaLogo, import.meta.url).href,
    logoDark: new URL(LaLigaLightLogo, import.meta.url).href,
  },
  leaguescup: {
    label: "Leagues Cup",
    color: "#6A1B9A",
    logo: new URL(LeaguesCupLogo, import.meta.url).href,
    logoDark: new URL(LeaguesCupLogoLight, import.meta.url).href,
  },
  ligue1: {
    label: "French Ligue",
    color: "#FF4B44",
    logo: new URL(Ligue1Logo, import.meta.url).href,
    logoDark: new URL(Ligue1LightLogo, import.meta.url).href,
  },
  ligue2: {
    label: "French Ligue 2",
    color: "#FF4B44",
    logo: new URL(Ligue2Logo, import.meta.url).href,
    logoDark: new URL(Ligue2LightLogo, import.meta.url).href,
  },
  mlb: { label: "MLB", color: "#002D72", logo: new URL(MLBLogo, import.meta.url).href, logoDark: new URL(MLBLogo, import.meta.url).href },
  mls: { label: "MLS", color: "#111111", logo: new URL(MLSLogo, import.meta.url).href, logoDark: new URL(MLSLogo, import.meta.url).href },
  msoc: {
    label: "Men's College Soccer",
    color: "#009CDE",
    logo: new URL(MCSLogo, import.meta.url).href,
    logoDark: new URL(MCSLogo, import.meta.url).href,
  },
  wsoc: {
    label: "Women's College Soccer",
    color: "#009CDE",
    logo: new URL(WCSLogo, import.meta.url).href,
    logoDark: new URL(WCSLogo, import.meta.url).href,
  },
  nascarpremier: {
    label: "NASCAR Premier",
    color: "#007AC2",
    logo: new URL(NascarLogo, import.meta.url).href,
    logoDark: new URL(NascarLightLogo, import.meta.url).href,
  },
  nba: { label: "NBA", color: "#1D428A", logo: new URL(NBALogo, import.meta.url).href, logoDark: new URL(NBALogo, import.meta.url).href },
  nfl: { label: "NFL", color: "#013369", logo: new URL(NFLLogo, import.meta.url).href, logoDark: new URL(NFLLogo, import.meta.url).href },
  nhl: { label: "NHL", color: "#000000", logo: new URL(NHLLogo, import.meta.url).href, logoDark: new URL(NHLLogo, import.meta.url).href },
  sb: {
    label: "College Softball",
    color: "#009CDE",
    logo: new URL(SBLogo, import.meta.url).href,
    logoDark: new URL(SBLogo, import.meta.url).href,
  },
  ufc: {
    label: "UFC",
    color: "#D20A0A",
    logo: new URL(UFCLogo, import.meta.url).href,
    logoDark: new URL(UFCLogoLight, import.meta.url).href,
  },
  ufl: {
    label: "UFL",
    color: "#003B71",
    logo: new URL(UFLLogo, import.meta.url).href,
    logoDark: new URL(UFLLightLogo, import.meta.url).href,
  },
  wcbb: {
    label: "W. College Basketball",
    color: "#009CDE",
    logo: new URL(WCBBLogo, import.meta.url).href,
    logoDark: new URL(WCBBLogo, import.meta.url).href,
  },
  wnba: {
    label: "WNBA",
    color: "#FF6B00",
    logo: new URL(WNBALogo, import.meta.url).href,
    logoDark: new URL(WNBALogoLight, import.meta.url).href,
  },
  wta: {
    label: "WTA Tennis",
    color: "#3B1C56",
    logo: new URL(WTALogo, import.meta.url).href,
    logoDark: new URL(WTALogoLight, import.meta.url).href,
  },
};
