export function periodLabel(number, league = "nba") {
  const n = Number(number);
  if (!Number.isInteger(n) || n < 1) return "";
  const regulation = league === "nhl" ? 3 : league === "mlb" ? 9 : 4;
  if (league !== "mlb" && n > regulation)
    return n === regulation + 1 ? "OT" : `${n - regulation}OT`;
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
  return `${n}${suffix}`;
}
export function summaryPlays(plays) {
  return (Array.isArray(plays) ? plays : [])
    .filter((p) => p && typeof p.text === "string" && p.text.trim())
    .map((p, index) => ({ ...p, _index: index }))
    .sort((a, b) => {
      const seqA = Number(a.sequenceNumber),
        seqB = Number(b.sequenceNumber);
      if (
        a.sequenceNumber != null &&
        b.sequenceNumber != null &&
        Number.isFinite(seqA) &&
        Number.isFinite(seqB) &&
        seqA !== seqB
      )
        return seqB - seqA;
      const period =
        Number(b.period?.number || 0) - Number(a.period?.number || 0);
      if (period) return period;
      return a._index - b._index;
    });
}
