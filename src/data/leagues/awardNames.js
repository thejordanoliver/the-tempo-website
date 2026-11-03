// Full award titles shared with the Tempo app.
const awardNames = {
  nba: {
    mvp: "NBA Most Valuable Player",
    roy: "NBA Rookie of the Year",
    dpoy: "NBA Defensive Player of the Year",
    sixthman: "NBA Sixth Man of the Year",
    coy: "NBA Coach of the Year",
    mip: "NBA Most Improved Player",
    fmvp: "NBA Finals Most Valuable Player",
  },
  wnba: {
    mvp: "WNBA Most Valuable Player",
    roy: "WNBA Rookie of the Year",
    dpoy: "WNBA Defensive Player of the Year",
    sixthman: "WNBA Sixth Man of the Year",
    coy: "WNBA Coach of the Year",
    mip: "WNBA Most Improved Player",
  },
  cfb: {
    heisman: "Heisman Trophy",
    apoy: "AP Player of the Year",
    camp: "Walter Camp Player of the Year",
    maxwell: "Maxwell Award",
    biletnikoff: "Fred Biletnikoff Award",
    doak: "Doak Walker Award",
    mackey: "John Mackey Award",
    groza: "Lou Groza Award",
    rimington: "Dave Rimington Trophy",
    outland: "Outland Trophy",
    thorpe: "Jim Thorpe Award",
    nagurski: "Bronko Nagurski Award",
    butkus: "Dick Butkus Award",
    hendricks: "Ted Hendricks Award",
    lombardi: "Lombardi Award",
    lott: "Ronnie Lott Trophy",
    obrien: "Davey O’Brien Award",
    manning: "Manning Award",
    unitas: "Johnny Unitas Award",
    apcoy: "AP Coach of the Year",
    afca: "AFCA Coach of the Year",
  },
  mcbb: {
    apoy: "Men's AP Player of The Year",
    naismith: "Men's Naismith Award",
    kareem: "Men's Kareem Abdul-Jabbar Award",
    cousy: "Men's Bob Cousy Award",
    erving: "Men's Julius Erving Award",
    malone: "Men's Karl Malone Award",
    west: "Men's Jerry West Award",
    wooden: "Men's Wooden Award",
  },
  wcbb: {
    apoy: "Women's AP Player of The Year",
    dpoy: "Women's Defensive Player of The Year",
    naismith: "Women's Naismith Award",
    mcclain: "Women's Lisa Leslie Award",
    lieberman: "Women's Nancy Lieberman Award",
    wooden: "Women's Wooden Award",
  },
  nfl: {
    mvp: "NFL Most Valuable Player",
    ropoy: "NFL Offensive Rookie of the Year",
    rdpoy: "NFL Defensive Rookie of the Year",
    opoy: "NFL Offensive Player of the Year",
    dpoy: "NFL Defensive Player of the Year",
    coy: "NFL Coach of the Year",
  },
  nhl: {
    mvp: "NHL Most Valuable Player",
    norris: "James Norris Memorial Trophy",
    selke: "NHL Frank J. Selke Trophy",
    coy: "NHL Coach of the Year",
  },
  mlb: {
    mvp: "MLB Most Valuable Player",
    young: "Cy Young Award",
    roy: "Jackie Robinson Rookie of The Year",
    coy: "MLB Manager of the Year",
  },
};

export function awardName(league, category) {
  return (
    awardNames[league]?.[category] ||
    category
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}
