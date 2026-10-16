import { test } from "node:test";
import assert from "node:assert/strict";
import { gameCardModel } from "../src/components/gameCardModel.js";
const base = {
  date: "2026-10-15T23:00:00Z",
  home: { score: 112, record: "2-0" },
  away: { score: 108, record: "1-1" },
};
test("scheduled cards show records rather than zero scores", () => {
  const card = gameCardModel(
    { ...base, status: { state: "pre", description: "Scheduled" } },
    "nba",
  );
  assert.equal(card.showRecords, true);
  assert.equal(card.winner, null);
});
test("completed games distinguish winner and tied scores", () => {
  assert.equal(
    gameCardModel(
      { ...base, status: { state: "post", description: "Final" } },
      "nba",
    ).winner,
    "home",
  );
  assert.equal(
    gameCardModel(
      {
        ...base,
        home: { score: 108 },
        status: { state: "post", description: "Final" },
      },
      "nfl",
    ).winner,
    null,
  );
});
test("live hockey overtime and clock are shown with the broadcast", () => {
  const card = gameCardModel(
    {
      ...base,
      status: {
        state: "in",
        description: "In Progress",
        period: 4,
        displayClock: "2:14",
      },
      broadcasts: ["ESPN"],
    },
    "nhl",
  );
  assert.equal(card.primary, "OT");
  assert.equal(card.secondary, "2:14");
  assert.equal(card.broadcast, "ESPN");
  assert.equal(card.winner, null);
});
test("postponements are not presented as finals, and championships use headline styling", () => {
  const card = gameCardModel(
    {
      ...base,
      status: { state: "post", description: "Postponed" },
      headline: "NBA Finals - Game 1",
    },
    "nba",
  );
  assert.equal(card.final, false);
  assert.equal(card.primary, "Postponed");
  assert.equal(card.showRecords, true);
  assert.equal(card.championship, true);
});
