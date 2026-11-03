import ATPLogo from "../../assets/league-logos/ATPLogo.png";
import BundesligaLightLogo from "../../assets/league-logos/BundesligaLightLogo.png";
import BundesligaLogo from "../../assets/league-logos/BundesligaLogo.png";
import CBLogo from "../../assets/league-logos/CBLogo.png";
import CFBLogo from "../../assets/league-logos/CFBLogo.png";
import EPLLogo from "../../assets/league-logos/EPLLogo.png";
import F1Logo from "../../assets/league-logos/F1Logo.png";
import F1LogoLight from "../../assets/league-logos/F1LogoLight.png";
import GLeagueLogo from "../../assets/league-logos/GLeagueLogo.png";
import GLeagueLogoLight from "../../assets/league-logos/GLeagueLogoLight.png";
import LaLigaLightLogo from "../../assets/league-logos/LaLigaLightLogo.png";
import LaLigaLogo from "../../assets/league-logos/LaLigaLogo.png";
import LeaguesCupLogo from "../../assets/league-logos/LeaguesCupLogo.png";
import LeaguesCupLogoLight from "../../assets/league-logos/LeaguesCupLogoLight.png";
import Ligue1LightLogo from "../../assets/league-logos/Ligue1LightLogo.png";
import Ligue1Logo from "../../assets/league-logos/Ligue1Logo.png";
import Ligue2LightLogo from "../../assets/league-logos/Ligue2LightLogo.png";
import Ligue2Logo from "../../assets/league-logos/Ligue2Logo.png";
import MCBBLogo from "../../assets/league-logos/MCBBLogo.png";
import MCSLogo from "../../assets/league-logos/MCSLogo.png";
import MCVBLogo from "../../assets/league-logos/MCVBLogo.png";
import MLBLogo from "../../assets/league-logos/MLBLogo.png";
import MLSLogo from "../../assets/league-logos/MLSLogo.png";
import NascarLightLogo from "../../assets/league-logos/NascarLightLogo.png";
import NascarLogo from "../../assets/league-logos/NascarLogo.png";
import NBALogo from "../../assets/league-logos/NBALogo.png";
import NFLLogo from "../../assets/league-logos/NFLLogo.png";
import NHLLogo from "../../assets/league-logos/NHLLogo.png";
import SBLogo from "../../assets/league-logos/SBLogo.png";
import UEFAChampionsLightLogo from "../../assets/league-logos/UEFAChampionsLightLogo.png";
import UEFAChampionsLogo from "../../assets/league-logos/UEFAChampionsLogo.png";
import UEFAEuropaLightLogo from "../../assets/league-logos/UEFAEuropaLightLogo.png";
import UEFAEuropaLogo from "../../assets/league-logos/UEFAEuropaLogo.png";
import UFCLogo from "../../assets/league-logos/UFCLogo.png";
import UFCLogoLight from "../../assets/league-logos/UFCLogoLight.png";
import UFLLightLogo from "../../assets/league-logos/UFLLightLogo.png";
import UFLLogo from "../../assets/league-logos/UFLLogo.png";
import WCBBLogo from "../../assets/league-logos/WCBBLogo.png";
import WCSLogo from "../../assets/league-logos/WCSLogo.png";
import WCVBLogo from "../../assets/league-logos/WCVBLogo.png";
import WNBALogo from "../../assets/league-logos/WNBALogo.png";
import WNBALogoLight from "../../assets/league-logos/WNBALogoLight.png";
import WorldCupLightLogo from "../../assets/league-logos/WorldCupLightLogo.png";
import WorldCupLogo from "../../assets/league-logos/WorldCupLogo.png";
import WTALogo from "../../assets/league-logos/WTALogo.png";
import WTALogoLight from "../../assets/league-logos/WTALogoLight.png";
export const favoriteLeagues = {
  mcvb: {
    label: "Men's College Volleyball",
    color: "#009CDE",
    logo: new URL(MCVBLogo, import.meta.url).href,
    logoDark: new URL(MCVBLogo, import.meta.url).href,
  },
  wcvb: {
    label: "Women's College Volleyball",
    color: "#009CDE",
    logo: new URL(WCVBLogo, import.meta.url).href,
    logoDark: new URL(WCVBLogo, import.meta.url).href,
  },
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
  f1: {
    label: "F1",
    color: "#E10600",
    logo: new URL(F1Logo, import.meta.url).href,
    logoDark: new URL(F1LogoLight, import.meta.url).href,
  },
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
    label: "French Ligue 1",
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
  mlb: {
    label: "MLB",
    color: "#002D72",
    logo: new URL(MLBLogo, import.meta.url).href,
    logoDark: new URL(MLBLogo, import.meta.url).href,
  },
  mls: {
    label: "MLS",
    color: "#111111",
    logo: new URL(MLSLogo, import.meta.url).href,
    logoDark: new URL(MLSLogo, import.meta.url).href,
  },
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
  nba: {
    label: "NBA",
    color: "#1D428A",
    logo: new URL(NBALogo, import.meta.url).href,
    logoDark: new URL(NBALogo, import.meta.url).href,
  },
  nfl: {
    label: "NFL",
    color: "#013369",
    logo: new URL(NFLLogo, import.meta.url).href,
    logoDark: new URL(NFLLogo, import.meta.url).href,
  },
  nhl: {
    label: "NHL",
    color: "#000000",
    logo: new URL(NHLLogo, import.meta.url).href,
    logoDark: new URL(NHLLogo, import.meta.url).href,
  },
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
