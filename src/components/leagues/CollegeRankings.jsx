import { useState } from "react";

import { collegeStandingsOptions } from "../../data/leagues/collegeStandings.js";
import { useResource } from "../../hooks/useResource.js";
import { State } from "../ui/State.jsx";
import LeagueControlSlot from "./LeagueControlSlot.jsx";
import { LeagueRecords } from "./LeagueRecords.jsx";
import StandingsTables from "./StandingsTables.jsx";
export default function CollegeRankings({ league, data }) {
  const [version, setVersion] = useState(0);
  const resource = useResource(`/api/standings/${league}/rankings`, version);
  return (
    <StandingsFilter
      league={league}
      data={data}
      rankings={resource.data}
      resource={resource}
      onRetry={() => setVersion((v) => v + 1)}
    />
  );
}
export function StandingsFilter({
  league,
  data,
  rankings,
  resource = {},
  onRetry,
}) {
  const [selection, setSelection] = useState("");
  const { options, defaultValue } = collegeStandingsOptions(
    data,
    rankings,
    league,
  );
  const selected =
    options.find((option) => option.value === (selection || defaultValue)) ||
    options.find((option) => option.value === defaultValue);
  const conferenceData =
    selected.kind === "conference"
      ? {
          ...data,
          conferences: data?.conferences?.length ? [selected.group] : [],
          groups: data?.conferences?.length
            ? []
            : [{ ...selected.group, children: [] }],
          standings: [],
        }
      : data;
  return (
    <section aria-label="College standings and polls">
      <LeagueControlSlot>
        <div className="league-controls" style={{ display: "contents" }}>
          <label>
            Standings / poll
            <select
              value={selected.value}
              onChange={(event) => setSelection(event.target.value)}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </LeagueControlSlot>
      <State {...resource} onRetry={onRetry} />
      {selected.kind === "poll" ? (
        <>
          <p className="page-note">
            Latest available poll
            {selected.poll.date
              ? ` · ${new Date(selected.poll.date).toLocaleDateString()}`
              : ""}
          </p>
          <LeagueRecords
            data={{ rankings: [selected.poll] }}
            tab="rankings"
            league={league}
          />
        </>
      ) : (
        (!resource.loading || selection) && (
          <StandingsTables data={conferenceData} league={league} />
        )
      )}
    </section>
  );
}
