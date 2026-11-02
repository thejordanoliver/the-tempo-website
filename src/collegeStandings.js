const list = value => Array.isArray(value) ? value : [];
export const hasCollegePolls = league => ["cfb", "mcbb", "wcbb", "mcvb", "wcvb"].includes(league);
export function collegeStandingsOptions(data, rankings, league) {
  const raw = rankings?.rankings;
  const polls = (Array.isArray(raw) ? raw : list(raw?.all)).filter(poll => list(poll.ranks).length);
  const pollOptions = polls.map((poll, index) => {
    const identity = `${poll.type || ""} ${poll.name || ""} ${poll.shortName || ""}`.toLowerCase();
    const type = /cfp|playoff/.test(identity) ? "cfp" : /coaches|afca|usa/.test(identity) ? "coaches" : /(^|\s)ap(\s|$)|associated press/.test(identity) ? "ap" : "other";
    // Preserve division and poll-provider names instead of merging every coaches poll label.
    const coachesName = poll.name?.trim();
    const coachesShortName = poll.shortName?.trim();
    const coachesLabel = !coachesName || /^coaches[’'’]? poll$/i.test(coachesName)
      ? coachesShortName || coachesName || "Coaches Poll"
      : coachesName;
    return {value: `poll:${index}`, kind: "poll", type, poll,
      label: type === "ap" ? "AP Top 25" : type === "cfp" ? "College Football Playoff Rankings" : type === "coaches" ? coachesLabel : poll.name || poll.shortName || "Rankings"};
  });
  const flatten = groups => list(groups).flatMap(group => [group, ...flatten(group.children)]);
  const conferences = list(data?.conferences).length ? data.conferences : flatten(data?.groups).filter(group => list(group.standings).length);
  const options = [...pollOptions, {value: "conferences", kind: "all", label: "All conferences"},
    ...conferences.map((group, index) => ({value: `conference:${index}`, kind: "conference", group, label: group.shortName || group.name || "Conference"}))];
  const preferred = (league === "cfb" && pollOptions.find(option => option.type === "cfp")) || pollOptions.find(option => option.type === "ap") || pollOptions[0];
  return {options, defaultValue: preferred?.value || "conferences"};
}
