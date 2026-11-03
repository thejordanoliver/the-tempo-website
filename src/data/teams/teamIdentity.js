import { wnbaTeams } from "./wnbaTeams.js";
// Team names and logos reused from the Tempo mobile app.
import asset92 from "../../assets/team-logos/mlb-Angels.png";
import asset89 from "../../assets/team-logos/mlb-Astros.png";
import asset71 from "../../assets/team-logos/mlb-Athletics.png";
import asset72 from "../../assets/team-logos/mlb-AthleticsLight.png";
import asset115 from "../../assets/team-logos/mlb-BlueJays.png";
import asset73 from "../../assets/team-logos/mlb-Braves.png";
import asset74 from "../../assets/team-logos/mlb-BravesLight.png";
import asset96 from "../../assets/team-logos/mlb-Brewers.png";
import asset109 from "../../assets/team-logos/mlb-Cardinals.png";
import asset110 from "../../assets/team-logos/mlb-CardinalsLight.png";
import asset78 from "../../assets/team-logos/mlb-Cubs.png";
import asset70 from "../../assets/team-logos/mlb-Diamondbacks.png";
import asset93 from "../../assets/team-logos/mlb-Dodgers.png";
import asset94 from "../../assets/team-logos/mlb-DodgersLight.png";
import asset107 from "../../assets/team-logos/mlb-Giants.png";
import asset83 from "../../assets/team-logos/mlb-Guardians.png";
import asset84 from "../../assets/team-logos/mlb-GuardiansLight.png";
import asset108 from "../../assets/team-logos/mlb-Mariners.png";
import asset95 from "../../assets/team-logos/mlb-Marlins.png";
import asset99 from "../../assets/team-logos/mlb-Mets.png";
import asset116 from "../../assets/team-logos/mlb-Nationals.png";
import asset117 from "../../assets/team-logos/mlb-NationalsLight.png";
import asset75 from "../../assets/team-logos/mlb-Orioles.png";
import asset105 from "../../assets/team-logos/mlb-Padres.png";
import asset106 from "../../assets/team-logos/mlb-PadresLight.png";
import asset102 from "../../assets/team-logos/mlb-Phillies.png";
import asset103 from "../../assets/team-logos/mlb-PhilliesLight.png";
import asset104 from "../../assets/team-logos/mlb-Pirates.png";
import asset113 from "../../assets/team-logos/mlb-Rangers.png";
import asset114 from "../../assets/team-logos/mlb-RangersLight.png";
import asset111 from "../../assets/team-logos/mlb-Rays.png";
import asset112 from "../../assets/team-logos/mlb-RaysLight.png";
import asset81 from "../../assets/team-logos/mlb-Reds.png";
import asset82 from "../../assets/team-logos/mlb-RedsLight.png";
import asset76 from "../../assets/team-logos/mlb-RedSox.png";
import asset77 from "../../assets/team-logos/mlb-RedSoxLight.png";
import asset85 from "../../assets/team-logos/mlb-Rockies.png";
import asset86 from "../../assets/team-logos/mlb-RockiesLight.png";
import asset90 from "../../assets/team-logos/mlb-Royals.png";
import asset91 from "../../assets/team-logos/mlb-RoyalsLight.png";
import asset87 from "../../assets/team-logos/mlb-Tigers.png";
import asset88 from "../../assets/team-logos/mlb-TigersLight.png";
import asset97 from "../../assets/team-logos/mlb-Twins.png";
import asset98 from "../../assets/team-logos/mlb-TwinsLight.png";
import asset79 from "../../assets/team-logos/mlb-WhiteSox.png";
import asset80 from "../../assets/team-logos/mlb-WhiteSoxLight.png";
import asset100 from "../../assets/team-logos/mlb-Yankees.png";
import asset101 from "../../assets/team-logos/mlb-YankeesLight.png";
import asset23 from "../../assets/team-logos/nba-76ers.png";
import asset24 from "../../assets/team-logos/nba-76ersLight.png";
import asset17 from "../../assets/team-logos/nba-Bucks.png";
import asset4 from "../../assets/team-logos/nba-Bulls.png";
import asset5 from "../../assets/team-logos/nba-Cavaliers.png";
import asset1 from "../../assets/team-logos/nba-Celtics.png";
import asset13 from "../../assets/team-logos/nba-Clippers.png";
import asset15 from "../../assets/team-logos/nba-Grizzlies.png";
import asset0 from "../../assets/team-logos/nba-Hawks.png";
import asset16 from "../../assets/team-logos/nba-Heat.png";
import asset3 from "../../assets/team-logos/nba-Hornets.png";
import asset31 from "../../assets/team-logos/nba-Jazz.png";
import asset32 from "../../assets/team-logos/nba-JazzLight.png";
import asset27 from "../../assets/team-logos/nba-Kings.png";
import asset20 from "../../assets/team-logos/nba-Knicks.png";
import asset14 from "../../assets/team-logos/nba-Lakers.png";
import asset22 from "../../assets/team-logos/nba-Magic.png";
import asset6 from "../../assets/team-logos/nba-Mavericks.png";
import asset2 from "../../assets/team-logos/nba-Nets.png";
import asset7 from "../../assets/team-logos/nba-Nuggets.png";
import asset12 from "../../assets/team-logos/nba-Pacers.png";
import asset19 from "../../assets/team-logos/nba-Pelicans.png";
import asset8 from "../../assets/team-logos/nba-Pistons.png";
import asset29 from "../../assets/team-logos/nba-Raptors.png";
import asset30 from "../../assets/team-logos/nba-RaptorsLight.png";
import asset10 from "../../assets/team-logos/nba-Rockets.png";
import asset11 from "../../assets/team-logos/nba-RocketsLight.png";
import asset28 from "../../assets/team-logos/nba-Spurs.png";
import asset25 from "../../assets/team-logos/nba-Suns.png";
import asset21 from "../../assets/team-logos/nba-Thunder.png";
import asset18 from "../../assets/team-logos/nba-Timberwolves.png";
import asset26 from "../../assets/team-logos/nba-TrailBlazers.png";
import asset9 from "../../assets/team-logos/nba-Warriors.png";
import asset33 from "../../assets/team-logos/nba-Wizards.png";
import asset49 from "../../assets/team-logos/nfl-49ers.png";
import asset68 from "../../assets/team-logos/nfl-AFC.png";
import asset51 from "../../assets/team-logos/nfl-Bears.png";
import asset44 from "../../assets/team-logos/nfl-Bengals.png";
import asset55 from "../../assets/team-logos/nfl-Bills.png";
import asset63 from "../../assets/team-logos/nfl-Broncos.png";
import asset43 from "../../assets/team-logos/nfl-Browns.png";
import asset59 from "../../assets/team-logos/nfl-Buccaneers.png";
import asset45 from "../../assets/team-logos/nfl-Cardinals.png";
import asset65 from "../../assets/team-logos/nfl-Chargers.png";
import asset52 from "../../assets/team-logos/nfl-Chiefs.png";
import asset56 from "../../assets/team-logos/nfl-Colts.png";
import asset53 from "../../assets/team-logos/nfl-Commanders.png";
import asset64 from "../../assets/team-logos/nfl-Cowboys.png";
import asset60 from "../../assets/team-logos/nfl-Dolphins.png";
import asset46 from "../../assets/team-logos/nfl-Eagles.png";
import asset42 from "../../assets/team-logos/nfl-Falcons.png";
import asset37 from "../../assets/team-logos/nfl-Giants.png";
import asset38 from "../../assets/team-logos/nfl-GiantsLight.png";
import asset35 from "../../assets/team-logos/nfl-Jaguars.png";
import asset47 from "../../assets/team-logos/nfl-Jets.png";
import asset48 from "../../assets/team-logos/nfl-JetsLight.png";
import asset41 from "../../assets/team-logos/nfl-Lions.png";
import asset69 from "../../assets/team-logos/nfl-NFC.png";
import asset50 from "../../assets/team-logos/nfl-Packers.png";
import asset54 from "../../assets/team-logos/nfl-Panthers.png";
import asset36 from "../../assets/team-logos/nfl-Patriots.png";
import asset34 from "../../assets/team-logos/nfl-Raiders.png";
import asset66 from "../../assets/team-logos/nfl-Rams.png";
import asset39 from "../../assets/team-logos/nfl-Ravens.png";
import asset62 from "../../assets/team-logos/nfl-Saints.png";
import asset58 from "../../assets/team-logos/nfl-Seahawks.png";
import asset57 from "../../assets/team-logos/nfl-Steelers.png";
import asset61 from "../../assets/team-logos/nfl-Texans.png";
import asset40 from "../../assets/team-logos/nfl-Titans.png";
import asset67 from "../../assets/team-logos/nfl-Vikings.png";
import asset130 from "../../assets/team-logos/nhl-Avalanche.png";
import asset131 from "../../assets/team-logos/nhl-AvalancheLight.png";
import asset128 from "../../assets/team-logos/nhl-Blackhawks.png";
import asset129 from "../../assets/team-logos/nhl-BlackhawksLight.png";
import asset132 from "../../assets/team-logos/nhl-BlueJackets.png";
import asset133 from "../../assets/team-logos/nhl-BlueJacketsLight.png";
import asset166 from "../../assets/team-logos/nhl-Blues.png";
import asset167 from "../../assets/team-logos/nhl-BluesLight.png";
import asset120 from "../../assets/team-logos/nhl-Bruins.png";
import asset121 from "../../assets/team-logos/nhl-BruinsLight.png";
import asset146 from "../../assets/team-logos/nhl-Canadiens.png";
import asset147 from "../../assets/team-logos/nhl-CanadiensLight.png";
import asset174 from "../../assets/team-logos/nhl-Canucks.png";
import asset175 from "../../assets/team-logos/nhl-CanucksLight.png";
import asset178 from "../../assets/team-logos/nhl-Capitals.png";
import asset179 from "../../assets/team-logos/nhl-CapitalsLight.png";
import asset150 from "../../assets/team-logos/nhl-Devils.png";
import asset151 from "../../assets/team-logos/nhl-DevilsLight.png";
import asset118 from "../../assets/team-logos/nhl-Ducks.png";
import asset119 from "../../assets/team-logos/nhl-DucksLight.png";
import asset124 from "../../assets/team-logos/nhl-Flames.png";
import asset125 from "../../assets/team-logos/nhl-FlamesLight.png";
import asset158 from "../../assets/team-logos/nhl-Flyers.png";
import asset159 from "../../assets/team-logos/nhl-FlyersLight.png";
import asset176 from "../../assets/team-logos/nhl-GoldenKnights.png";
import asset177 from "../../assets/team-logos/nhl-GoldenKnightsLight.png";
import asset126 from "../../assets/team-logos/nhl-Hurricanes.png";
import asset127 from "../../assets/team-logos/nhl-HurricanesLight.png";
import asset152 from "../../assets/team-logos/nhl-Islanders.png";
import asset153 from "../../assets/team-logos/nhl-IslandersLight.png";
import asset180 from "../../assets/team-logos/nhl-Jets.png";
import asset181 from "../../assets/team-logos/nhl-JetsLight.png";
import asset142 from "../../assets/team-logos/nhl-Kings.png";
import asset143 from "../../assets/team-logos/nhl-KingsLight.png";
import asset164 from "../../assets/team-logos/nhl-Kraken.png";
import asset165 from "../../assets/team-logos/nhl-KrakenLight.png";
import asset168 from "../../assets/team-logos/nhl-Lightning.png";
import asset169 from "../../assets/team-logos/nhl-LightningLight.png";
import asset172 from "../../assets/team-logos/nhl-Mammoth.png";
import asset173 from "../../assets/team-logos/nhl-MammothLight.png";
import asset170 from "../../assets/team-logos/nhl-MapleLeafs.png";
import asset171 from "../../assets/team-logos/nhl-MapleLeafsLight.png";
import asset138 from "../../assets/team-logos/nhl-Oilers.png";
import asset139 from "../../assets/team-logos/nhl-OilersLight.png";
import asset140 from "../../assets/team-logos/nhl-Panthers.png";
import asset141 from "../../assets/team-logos/nhl-PanthersLight.png";
import asset160 from "../../assets/team-logos/nhl-Penguins.png";
import asset161 from "../../assets/team-logos/nhl-PenguinsLight.png";
import asset148 from "../../assets/team-logos/nhl-Predators.png";
import asset149 from "../../assets/team-logos/nhl-PredatorsLight.png";
import asset154 from "../../assets/team-logos/nhl-Rangers.png";
import asset155 from "../../assets/team-logos/nhl-RangersLight.png";
import asset136 from "../../assets/team-logos/nhl-RedWings.png";
import asset137 from "../../assets/team-logos/nhl-RedWingsLight.png";
import asset122 from "../../assets/team-logos/nhl-Sabres.png";
import asset123 from "../../assets/team-logos/nhl-SabresLight.png";
import asset156 from "../../assets/team-logos/nhl-Senators.png";
import asset157 from "../../assets/team-logos/nhl-SenatorsLight.png";
import asset162 from "../../assets/team-logos/nhl-Sharks.png";
import asset163 from "../../assets/team-logos/nhl-SharksLight.png";
import asset134 from "../../assets/team-logos/nhl-Stars.png";
import asset135 from "../../assets/team-logos/nhl-StarsLight.png";
import asset144 from "../../assets/team-logos/nhl-Wild.png";
import asset145 from "../../assets/team-logos/nhl-WildLight.png";
const teams = {
  wnba: wnbaTeams,
  nba: {
    1: {
      name: "Hawks",
      logo: new URL(asset0, import.meta.url).href,
      logoLight: new URL(asset0, import.meta.url).href,
    },
    2: {
      name: "Celtics",
      logo: new URL(asset1, import.meta.url).href,
      logoLight: new URL(asset1, import.meta.url).href,
    },
    3: {
      name: "Pelicans",
      logo: new URL(asset19, import.meta.url).href,
      logoLight: new URL(asset19, import.meta.url).href,
    },
    4: {
      name: "Bulls",
      logo: new URL(asset4, import.meta.url).href,
      logoLight: new URL(asset4, import.meta.url).href,
    },
    5: {
      name: "Cavaliers",
      logo: new URL(asset5, import.meta.url).href,
      logoLight: new URL(asset5, import.meta.url).href,
    },
    6: {
      name: "Mavericks",
      logo: new URL(asset6, import.meta.url).href,
      logoLight: new URL(asset6, import.meta.url).href,
    },
    7: {
      name: "Nuggets",
      logo: new URL(asset7, import.meta.url).href,
      logoLight: new URL(asset7, import.meta.url).href,
    },
    8: {
      name: "Pistons",
      logo: new URL(asset8, import.meta.url).href,
      logoLight: new URL(asset8, import.meta.url).href,
    },
    9: {
      name: "Warriors",
      logo: new URL(asset9, import.meta.url).href,
      logoLight: new URL(asset9, import.meta.url).href,
    },
    10: {
      name: "Rockets",
      logo: new URL(asset10, import.meta.url).href,
      logoLight: new URL(asset11, import.meta.url).href,
    },
    11: {
      name: "Pacers",
      logo: new URL(asset12, import.meta.url).href,
      logoLight: new URL(asset12, import.meta.url).href,
    },
    12: {
      name: "Clippers",
      logo: new URL(asset13, import.meta.url).href,
      logoLight: new URL(asset13, import.meta.url).href,
    },
    13: {
      name: "Lakers",
      logo: new URL(asset14, import.meta.url).href,
      logoLight: new URL(asset14, import.meta.url).href,
    },
    14: {
      name: "Heat",
      logo: new URL(asset16, import.meta.url).href,
      logoLight: new URL(asset16, import.meta.url).href,
    },
    15: {
      name: "Bucks",
      logo: new URL(asset17, import.meta.url).href,
      logoLight: new URL(asset17, import.meta.url).href,
    },
    16: {
      name: "Timberwolves",
      logo: new URL(asset18, import.meta.url).href,
      logoLight: new URL(asset18, import.meta.url).href,
    },
    17: {
      name: "Nets",
      logo: new URL(asset2, import.meta.url).href,
      logoLight: new URL(asset2, import.meta.url).href,
    },
    18: {
      name: "Knicks",
      logo: new URL(asset20, import.meta.url).href,
      logoLight: new URL(asset20, import.meta.url).href,
    },
    19: {
      name: "Magic",
      logo: new URL(asset22, import.meta.url).href,
      logoLight: new URL(asset22, import.meta.url).href,
    },
    20: {
      name: "76ers",
      logo: new URL(asset23, import.meta.url).href,
      logoLight: new URL(asset24, import.meta.url).href,
    },
    21: {
      name: "Suns",
      logo: new URL(asset25, import.meta.url).href,
      logoLight: new URL(asset25, import.meta.url).href,
    },
    22: {
      name: "Trail Blazers",
      logo: new URL(asset26, import.meta.url).href,
      logoLight: new URL(asset26, import.meta.url).href,
    },
    23: {
      name: "Kings",
      logo: new URL(asset27, import.meta.url).href,
      logoLight: new URL(asset27, import.meta.url).href,
    },
    24: {
      name: "Spurs",
      logo: new URL(asset28, import.meta.url).href,
      logoLight: new URL(asset28, import.meta.url).href,
    },
    25: {
      name: "Thunder",
      logo: new URL(asset21, import.meta.url).href,
      logoLight: new URL(asset21, import.meta.url).href,
    },
    26: {
      name: "Jazz",
      logo: new URL(asset31, import.meta.url).href,
      logoLight: new URL(asset32, import.meta.url).href,
    },
    27: {
      name: "Wizards",
      logo: new URL(asset33, import.meta.url).href,
      logoLight: new URL(asset33, import.meta.url).href,
    },
    28: {
      name: "Raptors",
      logo: new URL(asset29, import.meta.url).href,
      logoLight: new URL(asset30, import.meta.url).href,
    },
    29: {
      name: "Grizzlies",
      logo: new URL(asset15, import.meta.url).href,
      logoLight: new URL(asset15, import.meta.url).href,
    },
    30: {
      name: "Hornets",
      logo: new URL(asset3, import.meta.url).href,
      logoLight: new URL(asset3, import.meta.url).href,
    },
    132761: {
      name: "Warriors Blue",
      logo: new URL(asset9, import.meta.url).href,
      logoLight: new URL(asset9, import.meta.url).href,
    },
  },
  nfl: {
    1: {
      name: "Falcons",
      logo: new URL(asset42, import.meta.url).href,
      logoLight: new URL(asset42, import.meta.url).href,
    },
    2: {
      name: "Bills",
      logo: new URL(asset55, import.meta.url).href,
      logoLight: new URL(asset55, import.meta.url).href,
    },
    3: {
      name: "Bears",
      logo: new URL(asset51, import.meta.url).href,
      logoLight: new URL(asset51, import.meta.url).href,
    },
    4: {
      name: "Bengals",
      logo: new URL(asset44, import.meta.url).href,
      logoLight: new URL(asset44, import.meta.url).href,
    },
    5: {
      name: "Browns",
      logo: new URL(asset43, import.meta.url).href,
      logoLight: new URL(asset43, import.meta.url).href,
    },
    6: {
      name: "Cowboys",
      logo: new URL(asset64, import.meta.url).href,
      logoLight: new URL(asset64, import.meta.url).href,
    },
    7: {
      name: "Broncos",
      logo: new URL(asset63, import.meta.url).href,
      logoLight: new URL(asset63, import.meta.url).href,
    },
    8: {
      name: "Lions",
      logo: new URL(asset41, import.meta.url).href,
      logoLight: new URL(asset41, import.meta.url).href,
    },
    9: {
      name: "Packers",
      logo: new URL(asset50, import.meta.url).href,
      logoLight: new URL(asset50, import.meta.url).href,
    },
    10: {
      name: "Titans",
      logo: new URL(asset40, import.meta.url).href,
      logoLight: new URL(asset40, import.meta.url).href,
    },
    11: {
      name: "Colts",
      logo: new URL(asset56, import.meta.url).href,
      logoLight: new URL(asset56, import.meta.url).href,
    },
    12: {
      name: "Chiefs",
      logo: new URL(asset52, import.meta.url).href,
      logoLight: new URL(asset52, import.meta.url).href,
    },
    13: {
      name: "Raiders",
      logo: new URL(asset34, import.meta.url).href,
      logoLight: new URL(asset34, import.meta.url).href,
    },
    14: {
      name: "Rams",
      logo: new URL(asset66, import.meta.url).href,
      logoLight: new URL(asset66, import.meta.url).href,
    },
    15: {
      name: "Dolphins",
      logo: new URL(asset60, import.meta.url).href,
      logoLight: new URL(asset60, import.meta.url).href,
    },
    16: {
      name: "Vikings",
      logo: new URL(asset67, import.meta.url).href,
      logoLight: new URL(asset67, import.meta.url).href,
    },
    17: {
      name: "Patriots",
      logo: new URL(asset36, import.meta.url).href,
      logoLight: new URL(asset36, import.meta.url).href,
    },
    18: {
      name: "Saints",
      logo: new URL(asset62, import.meta.url).href,
      logoLight: new URL(asset62, import.meta.url).href,
    },
    19: {
      name: "Giants",
      logo: new URL(asset37, import.meta.url).href,
      logoLight: new URL(asset38, import.meta.url).href,
    },
    20: {
      name: "Jets",
      logo: new URL(asset47, import.meta.url).href,
      logoLight: new URL(asset48, import.meta.url).href,
    },
    21: {
      name: "Eagles",
      logo: new URL(asset46, import.meta.url).href,
      logoLight: new URL(asset46, import.meta.url).href,
    },
    22: {
      name: "Cardinals",
      logo: new URL(asset45, import.meta.url).href,
      logoLight: new URL(asset45, import.meta.url).href,
    },
    23: {
      name: "Steelers",
      logo: new URL(asset57, import.meta.url).href,
      logoLight: new URL(asset57, import.meta.url).href,
    },
    24: {
      name: "Chargers",
      logo: new URL(asset65, import.meta.url).href,
      logoLight: new URL(asset65, import.meta.url).href,
    },
    25: {
      name: "49ers",
      logo: new URL(asset49, import.meta.url).href,
      logoLight: new URL(asset49, import.meta.url).href,
    },
    26: {
      name: "Seahawks",
      logo: new URL(asset58, import.meta.url).href,
      logoLight: new URL(asset58, import.meta.url).href,
    },
    27: {
      name: "Buccaneers",
      logo: new URL(asset59, import.meta.url).href,
      logoLight: new URL(asset59, import.meta.url).href,
    },
    28: {
      name: "Commanders",
      logo: new URL(asset53, import.meta.url).href,
      logoLight: new URL(asset53, import.meta.url).href,
    },
    29: {
      name: "Panthers",
      logo: new URL(asset54, import.meta.url).href,
      logoLight: new URL(asset54, import.meta.url).href,
    },
    30: {
      name: "Jaguars",
      logo: new URL(asset35, import.meta.url).href,
      logoLight: new URL(asset35, import.meta.url).href,
    },
    31: {
      name: "AFC",
      logo: new URL(asset68, import.meta.url).href,
      logoLight: new URL(asset68, import.meta.url).href,
    },
    32: {
      name: "NFC",
      logo: new URL(asset69, import.meta.url).href,
      logoLight: new URL(asset69, import.meta.url).href,
    },
    33: {
      name: "Ravens",
      logo: new URL(asset39, import.meta.url).href,
      logoLight: new URL(asset39, import.meta.url).href,
    },
    34: {
      name: "Texans",
      logo: new URL(asset61, import.meta.url).href,
      logoLight: new URL(asset61, import.meta.url).href,
    },
  },
  mlb: {
    1: {
      name: "Orioles",
      logo: new URL(asset75, import.meta.url).href,
      logoLight: new URL(asset75, import.meta.url).href,
    },
    2: {
      name: "Red Sox",
      logo: new URL(asset76, import.meta.url).href,
      logoLight: new URL(asset77, import.meta.url).href,
    },
    3: {
      name: "Angels",
      logo: new URL(asset92, import.meta.url).href,
      logoLight: new URL(asset92, import.meta.url).href,
    },
    4: {
      name: "White Sox",
      logo: new URL(asset79, import.meta.url).href,
      logoLight: new URL(asset80, import.meta.url).href,
    },
    5: {
      name: "Guardians",
      logo: new URL(asset83, import.meta.url).href,
      logoLight: new URL(asset84, import.meta.url).href,
    },
    6: {
      name: "Tigers",
      logo: new URL(asset87, import.meta.url).href,
      logoLight: new URL(asset88, import.meta.url).href,
    },
    7: {
      name: "Royals",
      logo: new URL(asset90, import.meta.url).href,
      logoLight: new URL(asset91, import.meta.url).href,
    },
    8: {
      name: "Brewers",
      logo: new URL(asset96, import.meta.url).href,
      logoLight: new URL(asset96, import.meta.url).href,
    },
    9: {
      name: "Twins",
      logo: new URL(asset97, import.meta.url).href,
      logoLight: new URL(asset98, import.meta.url).href,
    },
    10: {
      name: "Yankees",
      logo: new URL(asset100, import.meta.url).href,
      logoLight: new URL(asset101, import.meta.url).href,
    },
    11: {
      name: "Athletics",
      logo: new URL(asset71, import.meta.url).href,
      logoLight: new URL(asset72, import.meta.url).href,
    },
    12: {
      name: "Mariners",
      logo: new URL(asset108, import.meta.url).href,
      logoLight: new URL(asset108, import.meta.url).href,
    },
    13: {
      name: "Rangers",
      logo: new URL(asset113, import.meta.url).href,
      logoLight: new URL(asset114, import.meta.url).href,
    },
    14: {
      name: "Blue Jays",
      logo: new URL(asset115, import.meta.url).href,
      logoLight: new URL(asset115, import.meta.url).href,
    },
    15: {
      name: "Braves",
      logo: new URL(asset73, import.meta.url).href,
      logoLight: new URL(asset74, import.meta.url).href,
    },
    16: {
      name: "Cubs",
      logo: new URL(asset78, import.meta.url).href,
      logoLight: new URL(asset78, import.meta.url).href,
    },
    17: {
      name: "Reds",
      logo: new URL(asset81, import.meta.url).href,
      logoLight: new URL(asset82, import.meta.url).href,
    },
    18: {
      name: "Astros",
      logo: new URL(asset89, import.meta.url).href,
      logoLight: new URL(asset89, import.meta.url).href,
    },
    19: {
      name: "Dodgers",
      logo: new URL(asset93, import.meta.url).href,
      logoLight: new URL(asset94, import.meta.url).href,
    },
    20: {
      name: "Nationals",
      logo: new URL(asset116, import.meta.url).href,
      logoLight: new URL(asset117, import.meta.url).href,
    },
    21: {
      name: "Mets",
      logo: new URL(asset99, import.meta.url).href,
      logoLight: new URL(asset99, import.meta.url).href,
    },
    22: {
      name: "Phillies",
      logo: new URL(asset102, import.meta.url).href,
      logoLight: new URL(asset103, import.meta.url).href,
    },
    23: {
      name: "Pirates",
      logo: new URL(asset104, import.meta.url).href,
      logoLight: new URL(asset104, import.meta.url).href,
    },
    24: {
      name: "Cardinals",
      logo: new URL(asset109, import.meta.url).href,
      logoLight: new URL(asset110, import.meta.url).href,
    },
    25: {
      name: "Padres",
      logo: new URL(asset105, import.meta.url).href,
      logoLight: new URL(asset106, import.meta.url).href,
    },
    26: {
      name: "Giants",
      logo: new URL(asset107, import.meta.url).href,
      logoLight: new URL(asset107, import.meta.url).href,
    },
    27: {
      name: "Rockies",
      logo: new URL(asset85, import.meta.url).href,
      logoLight: new URL(asset86, import.meta.url).href,
    },
    28: {
      name: "Marlins",
      logo: new URL(asset95, import.meta.url).href,
      logoLight: new URL(asset95, import.meta.url).href,
    },
    29: {
      name: "Diamondbacks",
      logo: new URL(asset70, import.meta.url).href,
      logoLight: new URL(asset70, import.meta.url).href,
    },
    30: {
      name: "Rays",
      logo: new URL(asset111, import.meta.url).href,
      logoLight: new URL(asset112, import.meta.url).href,
    },
  },
  nhl: {
    1: {
      name: "Bruins",
      logo: new URL(asset120, import.meta.url).href,
      logoLight: new URL(asset121, import.meta.url).href,
    },
    2: {
      name: "Sabres",
      logo: new URL(asset122, import.meta.url).href,
      logoLight: new URL(asset123, import.meta.url).href,
    },
    3: {
      name: "Flames",
      logo: new URL(asset124, import.meta.url).href,
      logoLight: new URL(asset125, import.meta.url).href,
    },
    4: {
      name: "Blackhawks",
      logo: new URL(asset128, import.meta.url).href,
      logoLight: new URL(asset129, import.meta.url).href,
    },
    5: {
      name: "Red Wings",
      logo: new URL(asset136, import.meta.url).href,
      logoLight: new URL(asset137, import.meta.url).href,
    },
    6: {
      name: "Oilers",
      logo: new URL(asset138, import.meta.url).href,
      logoLight: new URL(asset139, import.meta.url).href,
    },
    7: {
      name: "Hurricanes",
      logo: new URL(asset126, import.meta.url).href,
      logoLight: new URL(asset127, import.meta.url).href,
    },
    8: {
      name: "Kings",
      logo: new URL(asset142, import.meta.url).href,
      logoLight: new URL(asset143, import.meta.url).href,
    },
    9: {
      name: "Stars",
      logo: new URL(asset134, import.meta.url).href,
      logoLight: new URL(asset135, import.meta.url).href,
    },
    10: {
      name: "Canadiens",
      logo: new URL(asset146, import.meta.url).href,
      logoLight: new URL(asset147, import.meta.url).href,
    },
    11: {
      name: "Devils",
      logo: new URL(asset150, import.meta.url).href,
      logoLight: new URL(asset151, import.meta.url).href,
    },
    12: {
      name: "Islanders",
      logo: new URL(asset152, import.meta.url).href,
      logoLight: new URL(asset153, import.meta.url).href,
    },
    13: {
      name: "Rangers",
      logo: new URL(asset154, import.meta.url).href,
      logoLight: new URL(asset155, import.meta.url).href,
    },
    14: {
      name: "Senators",
      logo: new URL(asset156, import.meta.url).href,
      logoLight: new URL(asset157, import.meta.url).href,
    },
    15: {
      name: "Flyers",
      logo: new URL(asset158, import.meta.url).href,
      logoLight: new URL(asset159, import.meta.url).href,
    },
    16: {
      name: "Penguins",
      logo: new URL(asset160, import.meta.url).href,
      logoLight: new URL(asset161, import.meta.url).href,
    },
    17: {
      name: "Avalanche",
      logo: new URL(asset130, import.meta.url).href,
      logoLight: new URL(asset131, import.meta.url).href,
    },
    18: {
      name: "Sharks",
      logo: new URL(asset162, import.meta.url).href,
      logoLight: new URL(asset163, import.meta.url).href,
    },
    19: {
      name: "Blues",
      logo: new URL(asset166, import.meta.url).href,
      logoLight: new URL(asset167, import.meta.url).href,
    },
    20: {
      name: "Lightning",
      logo: new URL(asset168, import.meta.url).href,
      logoLight: new URL(asset169, import.meta.url).href,
    },
    21: {
      name: "Maple Leafs",
      logo: new URL(asset170, import.meta.url).href,
      logoLight: new URL(asset171, import.meta.url).href,
    },
    22: {
      name: "Canucks",
      logo: new URL(asset174, import.meta.url).href,
      logoLight: new URL(asset175, import.meta.url).href,
    },
    23: {
      name: "Capitals",
      logo: new URL(asset178, import.meta.url).href,
      logoLight: new URL(asset179, import.meta.url).href,
    },
    25: {
      name: "Ducks",
      logo: new URL(asset118, import.meta.url).href,
      logoLight: new URL(asset119, import.meta.url).href,
    },
    26: {
      name: "Panthers",
      logo: new URL(asset140, import.meta.url).href,
      logoLight: new URL(asset141, import.meta.url).href,
    },
    27: {
      name: "Predators",
      logo: new URL(asset148, import.meta.url).href,
      logoLight: new URL(asset149, import.meta.url).href,
    },
    28: {
      name: "Jets",
      logo: new URL(asset180, import.meta.url).href,
      logoLight: new URL(asset181, import.meta.url).href,
    },
    29: {
      name: "Blue Jackets",
      logo: new URL(asset132, import.meta.url).href,
      logoLight: new URL(asset133, import.meta.url).href,
    },
    30: {
      name: "Wild",
      logo: new URL(asset144, import.meta.url).href,
      logoLight: new URL(asset145, import.meta.url).href,
    },
    37: {
      name: "Golden Knights",
      logo: new URL(asset176, import.meta.url).href,
      logoLight: new URL(asset177, import.meta.url).href,
    },
    124292: {
      name: "Kraken",
      logo: new URL(asset164, import.meta.url).href,
      logoLight: new URL(asset165, import.meta.url).href,
    },
    129764: {
      name: "Mammoth",
      logo: new URL(asset172, import.meta.url).href,
      logoLight: new URL(asset173, import.meta.url).href,
    },
  },
};
export const TEAM_PLACEHOLDER =
  "https://res.cloudinary.com/dm3qtdhag/image/upload/v1781619331/placeholder/team.png";

export function teamIdentity(team, league) {
  const local = teams[league]?.[String(team?.id)];
  return {
    ...team,
    shortName:
      local?.name || team?.shortName || team?.name || team?.code || "TBD",
    logo: local?.logo || team?.logo || TEAM_PLACEHOLDER,
    // The app’s logoLight assets are designed for dark backgrounds.
    logoDark:
      local?.logoLight ||
      local?.logo ||
      team?.logoDark ||
      team?.logoLight ||
      team?.logo ||
      TEAM_PLACEHOLDER,
    logoLight:
      local?.logoLight || team?.logoLight || team?.logo || TEAM_PLACEHOLDER,
  };
}
