export function getBroadcastDisplay(broadcasts = []) {
  if (!broadcasts?.length) return "";

  const allNames = broadcasts.map((n) => n.toLowerCase()).filter(Boolean);

  const networkMap = [
    ["espn2", "ESPN2"],
    ["espn3", "ESPN3"],
    ["espn+", "ESPN+"],
    ["espnu", "ESPNU"],
    ["sec network", "SECN"],
    ["secn+", "SECN+"],
    ["acc network", "ACCN"],
    ["abc", "ABC"],
    ["tnt", "TNT"],
    ["btn", "BTN"],
    ["tbs", "TBS"],
    ["fox sports", "FS1"],
    ["fs1", "FS1"],
    ["fox", "FOX"],
    ["cbs", "CBS"],
    ["peacock", "Peacock"],
    ["nbc", "NBC"],
    ["netflix", "Netflix"],
    ["prime video", "Prime"],
    ["amazon", "Prime"],
    ["nba league pass", "NBA League Pass"],
    ["nba tv", "NBA TV"],
    ["hbo max", "MAX"],
    ["max", "MAX"],
    ["espn", "ESPN"],
  ];

  // special combos
  if (
    allNames.some((n) => n.includes("abc")) &&
    allNames.some((n) => n.includes("espn"))
  )
    return "ABC/ESPN";
  if (
    allNames.some((n) => n.includes("nbc")) &&
    allNames.some((n) => n.includes("peacock"))
  )
    return "NBC/Peacock";
  if (
    allNames.some((n) => n.includes("tnt")) &&
    allNames.some((n) => n.includes("max"))
  )
    return "TNT/MAX";

  for (const [key, value] of networkMap) {
    if (allNames.some((n) => n.includes(key))) {
      return value;
    }
  }

  // fallback
  const first = broadcasts[0];
  return first ? first.replace(/\b\w/g, (c) => c.toUpperCase()) : "";
}
