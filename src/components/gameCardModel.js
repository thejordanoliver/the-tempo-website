export function ordinal(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) return "";
  const suffix =
    number % 100 >= 11 && number % 100 <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th";
  return `${number}${suffix}`;
}
export function gameCardModel(game, league) {
  const status = game.status || {},
    description = status.description || "",
    state = status.state;
  const interrupted = /cancel|postpon|delay|suspend|forfeit/i.test(description);
  const scheduled = state === "pre" || description === "Scheduled";
  const final =
    !interrupted &&
    (state === "post" || status.completed || /^final/i.test(description));
  const live =
    !final &&
    !interrupted &&
    (state === "in" || /in progress|halftime|end of period/i.test(description));
  const date = new Date(game.date || game.startDate || "");
  const dateText = Number.isNaN(date.valueOf())
    ? "Date TBD"
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const timeText =
    /TBD/i.test(status.shortDetail || "") || Number.isNaN(date.valueOf())
      ? "TBD"
      : date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        });
  const period = Number(status.period);
  const regulation = league === "nhl" ? 3 : 4;
  const periodText =
    Number.isFinite(period) && period > regulation && league !== "mlb"
      ? period === regulation + 1
        ? "OT"
        : `${period - regulation}OT`
      : ordinal(period);
  let primary, secondary;
  if (interrupted) primary = description;
  else if (final) {
    primary = status.shortDetail || description || "Final";
    secondary = dateText;
  } else if (/halftime|intermission|end of period/i.test(description))
    primary = /end of period/i.test(description)
      ? `End of ${periodText}`
      : description;
  else if (live && league === "mlb")
    primary = status.shortDetail || status.detail || description || periodText;
  else if (live) {
    primary = periodText || description || "Live";
    secondary = status.displayClock || status.clock || "";
  } else {
    primary = dateText;
    secondary = timeText;
  }
  const broadcasts = Array.isArray(game.broadcasts)
    ? game.broadcasts.filter((b) => typeof b === "string")
    : [];
  const showRecords = scheduled || /cancel|postpon|delay/i.test(description);
  const homeScore = Number(game.home?.score),
    awayScore = Number(game.away?.score);
  const hasScores =
    game.home?.score != null &&
    game.away?.score != null &&
    Number.isFinite(homeScore) &&
    Number.isFinite(awayScore);
  const winner =
    final && hasScores && homeScore !== awayScore
      ? homeScore > awayScore
        ? "home"
        : "away"
      : null;
  return {
    primary,
    secondary,
    final,
    live,
    showRecords,
    winner,
    broadcast: !final && !interrupted ? broadcasts.join(" · ") : "",
    headline: game.headline || "",
    championship:
      /nba finals|super bowl|world series|stanley cup final|national championship/i.test(
        game.headline || "",
      ),
  };
}
