import assert from "node:assert/strict";
import test from "node:test";
import { shortStatLabel } from "../src/data/players/statHeaders.js";

test("player stat headers use compact standard abbreviations", () => {
  for (const [key, expected] of Object.entries({
    avgPoints: "PTS",
    avgRebounds: "REB",
    avgAssists: "AST",
    avgMinutes: "MIN",
    fieldGoalPct: "FG%",
    gamesPlayed: "GP",
    avgDefensiveRebounds: "DREB",
    threePointFieldGoalPct: "3P%",
    "avgFieldGoalsMade-avgFieldGoalsAttempted": "FGM/FGA",
    passingYards: "PASS YDS",
    earnedRunAverage: "ERA",
  }))
    assert.equal(shortStatLabel(key), expected);
});
test("existing compact labels and unknown stats retain readable text", () => {
  assert.equal(shortStatLabel("PTS"), "PTS");
  assert.equal(shortStatLabel("FG%"), "FG%");
  assert.equal(shortStatLabel("newMetric"), "New Metric");
});
