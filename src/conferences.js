import conferenceAsset0 from "./conference-logos/CFB.png";
import conferenceAsset1 from "./conference-logos/ACC.png";
import conferenceAsset2 from "./conference-logos/ACCLight.png";
import conferenceAsset3 from "./conference-logos/American.png";
import conferenceAsset4 from "./conference-logos/Big12.png";
import conferenceAsset5 from "./conference-logos/BIG12Light.png";
import conferenceAsset6 from "./conference-logos/BigTen.png";
import conferenceAsset7 from "./conference-logos/BIGTenLight.png";
import conferenceAsset8 from "./conference-logos/CUSA.png";
import conferenceAsset9 from "./conference-logos/CUSALight.png";
import conferenceAsset10 from "./conference-logos/MAC.png";
import conferenceAsset11 from "./conference-logos/MWC.png";
import conferenceAsset12 from "./conference-logos/PAC12.png";
import conferenceAsset13 from "./conference-logos/SEC.png";
import conferenceAsset14 from "./conference-logos/SunBelt.png";
import conferenceAsset15 from "./conference-logos/BigSky.png";
import conferenceAsset16 from "./conference-logos/CAA.png";
import conferenceAsset17 from "./conference-logos/IvyLeague.png";
import conferenceAsset18 from "./conference-logos/MEAC.png";
import conferenceAsset19 from "./conference-logos/MVFC.png";
import conferenceAsset20 from "./conference-logos/NEC.png";
import conferenceAsset21 from "./conference-logos/OVC.png";
import conferenceAsset22 from "./conference-logos/PatriotLeague.png";
import conferenceAsset23 from "./conference-logos/PioneerLeague.png";
import conferenceAsset24 from "./conference-logos/SoCon.png";
import conferenceAsset25 from "./conference-logos/SLC.png";
import conferenceAsset26 from "./conference-logos/SWAC.png";
import conferenceAsset27 from "./conference-logos/MCBB.png";
import conferenceAsset28 from "./conference-logos/A10.png";
import conferenceAsset29 from "./conference-logos/AmericaEast.png";
import conferenceAsset30 from "./conference-logos/BigEast.png";
import conferenceAsset31 from "./conference-logos/BigSouth.png";
import conferenceAsset32 from "./conference-logos/BigWest.png";
import conferenceAsset33 from "./conference-logos/MAAC.png";
import conferenceAsset34 from "./conference-logos/WAC.png";
import conferenceAsset35 from "./conference-logos/WCBB.png";
const conferences = {
  cfb: [
    {
      name: "FBS",
      shortName: "FBS",
      logo: new URL(conferenceAsset0, import.meta.url).href,
      logoDark: new URL(conferenceAsset0, import.meta.url).href,
    },
    {
      name: "Atlantic Coast Conference",
      shortName: "ACC",
      logo: new URL(conferenceAsset1, import.meta.url).href,
      logoDark: new URL(conferenceAsset2, import.meta.url).href,
    },
    {
      name: "American Conference",
      shortName: "American",
      logo: new URL(conferenceAsset3, import.meta.url).href,
      logoDark: new URL(conferenceAsset3, import.meta.url).href,
    },
    {
      name: "Big 12 Conference",
      shortName: "Big 12",
      logo: new URL(conferenceAsset4, import.meta.url).href,
      logoDark: new URL(conferenceAsset5, import.meta.url).href,
    },
    {
      name: "Big Ten Conference",
      shortName: "Big Ten",
      logo: new URL(conferenceAsset6, import.meta.url).href,
      logoDark: new URL(conferenceAsset7, import.meta.url).href,
    },
    {
      name: "Conference USA",
      shortName: "CUSA",
      logo: new URL(conferenceAsset8, import.meta.url).href,
      logoDark: new URL(conferenceAsset9, import.meta.url).href,
    },
    {
      name: "Mid-American Conference",
      shortName: "MAC",
      logo: new URL(conferenceAsset10, import.meta.url).href,
      logoDark: new URL(conferenceAsset10, import.meta.url).href,
    },
    {
      name: "Mountain West Conference",
      shortName: "Mountain West",
      logo: new URL(conferenceAsset11, import.meta.url).href,
      logoDark: new URL(conferenceAsset11, import.meta.url).href,
    },
    {
      name: "Pac-12 Conference",
      shortName: "Pac-12",
      logo: new URL(conferenceAsset12, import.meta.url).href,
      logoDark: new URL(conferenceAsset12, import.meta.url).href,
    },
    {
      name: "Southeastern Conference",
      shortName: "SEC",
      logo: new URL(conferenceAsset13, import.meta.url).href,
      logoDark: new URL(conferenceAsset13, import.meta.url).href,
    },
    {
      name: "Sun Belt Conference",
      shortName: "Sun Belt",
      logo: new URL(conferenceAsset14, import.meta.url).href,
      logoDark: new URL(conferenceAsset14, import.meta.url).href,
    },
    {
      name: "Big Sky Conference",
      shortName: "Big Sky",
      logo: new URL(conferenceAsset15, import.meta.url).href,
      logoDark: new URL(conferenceAsset15, import.meta.url).href,
    },
    {
      name: "Coastal Athletic Association",
      shortName: "CAA",
      logo: new URL(conferenceAsset16, import.meta.url).href,
      logoDark: new URL(conferenceAsset16, import.meta.url).href,
    },
    {
      name: "Ivy League",
      shortName: "Ivy",
      logo: new URL(conferenceAsset17, import.meta.url).href,
      logoDark: new URL(conferenceAsset17, import.meta.url).href,
    },
    {
      name: "Mid-Eastern Athletic Conference",
      shortName: "MEAC",
      logo: new URL(conferenceAsset18, import.meta.url).href,
      logoDark: new URL(conferenceAsset18, import.meta.url).href,
    },
    {
      name: "Missouri Valley Football Conference",
      shortName: "MVFC",
      logo: new URL(conferenceAsset19, import.meta.url).href,
      logoDark: new URL(conferenceAsset19, import.meta.url).href,
    },
    {
      name: "Northeast Conference",
      shortName: "NEC",
      logo: new URL(conferenceAsset20, import.meta.url).href,
      logoDark: new URL(conferenceAsset20, import.meta.url).href,
    },
    {
      name: "OVC-Big South Association",
      shortName: "OVC-Big South",
      logo: new URL(conferenceAsset21, import.meta.url).href,
      logoDark: new URL(conferenceAsset21, import.meta.url).href,
    },
    {
      name: "Patriot League",
      shortName: "Patriot",
      logo: new URL(conferenceAsset22, import.meta.url).href,
      logoDark: new URL(conferenceAsset22, import.meta.url).href,
    },
    {
      name: "Pioneer Football League",
      shortName: "Pioneer",
      logo: new URL(conferenceAsset23, import.meta.url).href,
      logoDark: new URL(conferenceAsset23, import.meta.url).href,
    },
    {
      name: "Southern Conference",
      shortName: "Southern",
      logo: new URL(conferenceAsset24, import.meta.url).href,
      logoDark: new URL(conferenceAsset24, import.meta.url).href,
    },
    {
      name: "Southland Conference",
      shortName: "Southland",
      logo: new URL(conferenceAsset25, import.meta.url).href,
      logoDark: new URL(conferenceAsset25, import.meta.url).href,
    },
    {
      name: "Southwestern Athletic Conference",
      shortName: "SWAC",
      logo: new URL(conferenceAsset26, import.meta.url).href,
      logoDark: new URL(conferenceAsset26, import.meta.url).href,
    },
    {
      name: "DIV II/III",
      shortName: "DIV II/III",
      logo: new URL(conferenceAsset0, import.meta.url).href,
      logoDark: new URL(conferenceAsset0, import.meta.url).href,
    },
  ],
  mcbb: [
    {
      name: "Top 25",
      shortName: "Top 25",
      logo: new URL(conferenceAsset27, import.meta.url).href,
      logoDark: new URL(conferenceAsset27, import.meta.url).href,
    },
    {
      name: "Division I",
      shortName: "DIV I",
      logo: new URL(conferenceAsset27, import.meta.url).href,
      logoDark: new URL(conferenceAsset27, import.meta.url).href,
    },
    {
      name: "Atlantic 10 Conference",
      shortName: "A-10",
      logo: new URL(conferenceAsset28, import.meta.url).href,
      logoDark: new URL(conferenceAsset28, import.meta.url).href,
    },
    {
      name: "Atlantic Coast Conference",
      shortName: "ACC",
      logo: new URL(conferenceAsset1, import.meta.url).href,
      logoDark: new URL(conferenceAsset2, import.meta.url).href,
    },
    {
      name: "America East Conference",
      shortName: "Am. East",
      logo: new URL(conferenceAsset29, import.meta.url).href,
      logoDark: new URL(conferenceAsset29, import.meta.url).href,
    },
    {
      name: "American Conference",
      shortName: "American",
      logo: new URL(conferenceAsset3, import.meta.url).href,
      logoDark: new URL(conferenceAsset3, import.meta.url).href,
    },
    {
      name: "Big 12 Conference",
      shortName: "Big 12",
      logo: new URL(conferenceAsset4, import.meta.url).href,
      logoDark: new URL(conferenceAsset5, import.meta.url).href,
    },
    {
      name: "Big East Conference",
      shortName: "Big East",
      logo: new URL(conferenceAsset30, import.meta.url).href,
      logoDark: new URL(conferenceAsset30, import.meta.url).href,
    },
    {
      name: "Big Sky Conference",
      shortName: "Big Sky",
      logo: new URL(conferenceAsset15, import.meta.url).href,
      logoDark: new URL(conferenceAsset15, import.meta.url).href,
    },
    {
      name: "Big South Conference",
      shortName: "Big South",
      logo: new URL(conferenceAsset31, import.meta.url).href,
      logoDark: new URL(conferenceAsset31, import.meta.url).href,
    },
    {
      name: "Big Ten Conference",
      shortName: "Big Ten",
      logo: new URL(conferenceAsset7, import.meta.url).href,
      logoDark: new URL(conferenceAsset6, import.meta.url).href,
    },
    {
      name: "Big West Conference",
      shortName: "Big West",
      logo: new URL(conferenceAsset32, import.meta.url).href,
      logoDark: new URL(conferenceAsset32, import.meta.url).href,
    },
    {
      name: "Coastal Athletic Association",
      shortName: "CAA",
      logo: new URL(conferenceAsset16, import.meta.url).href,
      logoDark: new URL(conferenceAsset16, import.meta.url).href,
    },
    {
      name: "Conference USA",
      shortName: "CUSA",
      logo: new URL(conferenceAsset8, import.meta.url).href,
      logoDark: new URL(conferenceAsset9, import.meta.url).href,
    },
    {
      name: "Ivy League",
      shortName: "Ivy",
      logo: new URL(conferenceAsset17, import.meta.url).href,
      logoDark: new URL(conferenceAsset17, import.meta.url).href,
    },
    {
      name: "Metro Atlantic Athletic Conference",
      shortName: "MAAC",
      logo: new URL(conferenceAsset33, import.meta.url).href,
      logoDark: new URL(conferenceAsset33, import.meta.url).href,
    },
    {
      name: "Mid-American Conference",
      shortName: "MAC",
      logo: new URL(conferenceAsset10, import.meta.url).href,
      logoDark: new URL(conferenceAsset10, import.meta.url).href,
    },
    {
      name: "Mid-Eastern Athletic Conference",
      shortName: "MEAC",
      logo: new URL(conferenceAsset18, import.meta.url).href,
      logoDark: new URL(conferenceAsset18, import.meta.url).href,
    },
    {
      name: "Mountain West Conference",
      shortName: "Mountain West",
      logo: new URL(conferenceAsset11, import.meta.url).href,
      logoDark: new URL(conferenceAsset11, import.meta.url).href,
    },
    {
      name: "Missouri Valley Conference",
      shortName: "MVC",
      logo: new URL(conferenceAsset19, import.meta.url).href,
      logoDark: new URL(conferenceAsset19, import.meta.url).href,
    },
    {
      name: "Northeast Conference",
      shortName: "NEC",
      logo: new URL(conferenceAsset20, import.meta.url).href,
      logoDark: new URL(conferenceAsset20, import.meta.url).href,
    },
    {
      name: "Ohio Valley Conference",
      shortName: "OVC",
      logo: new URL(conferenceAsset21, import.meta.url).href,
      logoDark: new URL(conferenceAsset21, import.meta.url).href,
    },
    {
      name: "Patriot League",
      shortName: "Patriot",
      logo: new URL(conferenceAsset22, import.meta.url).href,
      logoDark: new URL(conferenceAsset22, import.meta.url).href,
    },
    {
      name: "Southeastern Conference",
      shortName: "SEC",
      logo: new URL(conferenceAsset13, import.meta.url).href,
      logoDark: new URL(conferenceAsset13, import.meta.url).href,
    },
    {
      name: "Southern Conference",
      shortName: "SoCon",
      logo: new URL(conferenceAsset24, import.meta.url).href,
      logoDark: new URL(conferenceAsset24, import.meta.url).href,
    },
    {
      name: "Southland Conference",
      shortName: "Southland",
      logo: new URL(conferenceAsset25, import.meta.url).href,
      logoDark: new URL(conferenceAsset25, import.meta.url).href,
    },
    {
      name: "Sun Belt Conference",
      shortName: "Sun Belt",
      logo: new URL(conferenceAsset14, import.meta.url).href,
      logoDark: new URL(conferenceAsset14, import.meta.url).href,
    },
    {
      name: "Southwestern Athletic Conference",
      shortName: "SWAC",
      logo: new URL(conferenceAsset26, import.meta.url).href,
      logoDark: new URL(conferenceAsset26, import.meta.url).href,
    },
    {
      name: "Western Athletic Conference",
      shortName: "WAC",
      logo: new URL(conferenceAsset34, import.meta.url).href,
      logoDark: new URL(conferenceAsset34, import.meta.url).href,
    },
  ],
  wcbb: [
    {
      name: "Top 25",
      shortName: "Top 25",
      logo: new URL(conferenceAsset35, import.meta.url).href,
      logoDark: new URL(conferenceAsset35, import.meta.url).href,
    },
    {
      name: "Division I",
      shortName: "DIV I",
      logo: new URL(conferenceAsset35, import.meta.url).href,
      logoDark: new URL(conferenceAsset35, import.meta.url).href,
    },
    {
      name: "Atlantic 10 Conference",
      shortName: "A-10",
      logo: new URL(conferenceAsset28, import.meta.url).href,
      logoDark: new URL(conferenceAsset28, import.meta.url).href,
    },
    {
      name: "Atlantic Coast Conference",
      shortName: "ACC",
      logo: new URL(conferenceAsset1, import.meta.url).href,
      logoDark: new URL(conferenceAsset2, import.meta.url).href,
    },
    {
      name: "America East Conference",
      shortName: "Am. East",
      logo: new URL(conferenceAsset29, import.meta.url).href,
      logoDark: new URL(conferenceAsset29, import.meta.url).href,
    },
    {
      name: "American Conference",
      shortName: "American",
      logo: new URL(conferenceAsset3, import.meta.url).href,
      logoDark: new URL(conferenceAsset3, import.meta.url).href,
    },
    {
      name: "Big 12 Conference",
      shortName: "Big 12",
      logo: new URL(conferenceAsset4, import.meta.url).href,
      logoDark: new URL(conferenceAsset5, import.meta.url).href,
    },
    {
      name: "Big East Conference",
      shortName: "Big East",
      logo: new URL(conferenceAsset30, import.meta.url).href,
      logoDark: new URL(conferenceAsset30, import.meta.url).href,
    },
    {
      name: "Big Sky Conference",
      shortName: "Big Sky",
      logo: new URL(conferenceAsset15, import.meta.url).href,
      logoDark: new URL(conferenceAsset15, import.meta.url).href,
    },
    {
      name: "Big South Conference",
      shortName: "Big South",
      logo: new URL(conferenceAsset31, import.meta.url).href,
      logoDark: new URL(conferenceAsset31, import.meta.url).href,
    },
    {
      name: "Big Ten Conference",
      shortName: "Big Ten",
      logo: new URL(conferenceAsset7, import.meta.url).href,
      logoDark: new URL(conferenceAsset6, import.meta.url).href,
    },
    {
      name: "Big West Conference",
      shortName: "Big West",
      logo: new URL(conferenceAsset32, import.meta.url).href,
      logoDark: new URL(conferenceAsset32, import.meta.url).href,
    },
    {
      name: "Coastal Athletic Association",
      shortName: "CAA",
      logo: new URL(conferenceAsset16, import.meta.url).href,
      logoDark: new URL(conferenceAsset16, import.meta.url).href,
    },
    {
      name: "Conference USA",
      shortName: "CUSA",
      logo: new URL(conferenceAsset8, import.meta.url).href,
      logoDark: new URL(conferenceAsset9, import.meta.url).href,
    },
    {
      name: "Ivy League",
      shortName: "Ivy",
      logo: new URL(conferenceAsset17, import.meta.url).href,
      logoDark: new URL(conferenceAsset17, import.meta.url).href,
    },
    {
      name: "Metro Atlantic Athletic Conference",
      shortName: "MAAC",
      logo: new URL(conferenceAsset33, import.meta.url).href,
      logoDark: new URL(conferenceAsset33, import.meta.url).href,
    },
    {
      name: "Mid-American Conference",
      shortName: "MAC",
      logo: new URL(conferenceAsset10, import.meta.url).href,
      logoDark: new URL(conferenceAsset10, import.meta.url).href,
    },
    {
      name: "Mid-Eastern Athletic Conference",
      shortName: "MEAC",
      logo: new URL(conferenceAsset18, import.meta.url).href,
      logoDark: new URL(conferenceAsset18, import.meta.url).href,
    },
    {
      name: "Mountain West Conference",
      shortName: "Mountain West",
      logo: new URL(conferenceAsset11, import.meta.url).href,
      logoDark: new URL(conferenceAsset11, import.meta.url).href,
    },
    {
      name: "Missouri Valley Conference",
      shortName: "MVC",
      logo: new URL(conferenceAsset19, import.meta.url).href,
      logoDark: new URL(conferenceAsset19, import.meta.url).href,
    },
    {
      name: "Northeast Conference",
      shortName: "NEC",
      logo: new URL(conferenceAsset20, import.meta.url).href,
      logoDark: new URL(conferenceAsset20, import.meta.url).href,
    },
    {
      name: "Ohio Valley Conference",
      shortName: "OVC",
      logo: new URL(conferenceAsset21, import.meta.url).href,
      logoDark: new URL(conferenceAsset21, import.meta.url).href,
    },
    {
      name: "Patriot League",
      shortName: "Patriot",
      logo: new URL(conferenceAsset22, import.meta.url).href,
      logoDark: new URL(conferenceAsset22, import.meta.url).href,
    },
    {
      name: "Southeastern Conference",
      shortName: "SEC",
      logo: new URL(conferenceAsset13, import.meta.url).href,
      logoDark: new URL(conferenceAsset13, import.meta.url).href,
    },
    {
      name: "Southern Conference",
      shortName: "SoCon",
      logo: new URL(conferenceAsset24, import.meta.url).href,
      logoDark: new URL(conferenceAsset24, import.meta.url).href,
    },
    {
      name: "Southland Conference",
      shortName: "Southland",
      logo: new URL(conferenceAsset25, import.meta.url).href,
      logoDark: new URL(conferenceAsset25, import.meta.url).href,
    },
    {
      name: "Sun Belt Conference",
      shortName: "Sun Belt",
      logo: new URL(conferenceAsset14, import.meta.url).href,
      logoDark: new URL(conferenceAsset14, import.meta.url).href,
    },
    {
      name: "Southwestern Athletic Conference",
      shortName: "SWAC",
      logo: new URL(conferenceAsset26, import.meta.url).href,
      logoDark: new URL(conferenceAsset26, import.meta.url).href,
    },
    {
      name: "Western Athletic Conference",
      shortName: "WAC",
      logo: new URL(conferenceAsset34, import.meta.url).href,
      logoDark: new URL(conferenceAsset34, import.meta.url).href,
    },
  ],
};
export function conferenceIdentity(conference, league) {
  if (!conference) return null;
  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const names = [conference.name, conference.shortName]
    .filter(Boolean)
    .map(normalize);
  const local = conferences[league]?.find(
    (item) =>
      names.includes(normalize(item.name)) ||
      names.includes(normalize(item.shortName)),
  );
  return {
    ...conference,
    shortName: conference.shortName || local?.shortName || conference.name,
    logo: local?.logo || conference.logo,
    logoDark: local?.logoDark || conference.logoDark || conference.logo,
  };
}
