import test from "node:test";
import assert from "node:assert/strict";
import { ufcEventOptions } from "../src/ufcEvents.js";
const past = {id: "1", date: "2026-01-01"};
const upcoming = {id: "2", date: "2026-12-01"};
test("UFC defaults to the next event and orders the event selector by date", () => {
  const result = ufcEventOptions({events: [upcoming, past]}, Date.parse("2026-11-01"));
  assert.deepEqual(result.events, [past, upcoming]);
  assert.equal(result.defaultId, "2");
});
test("UFC prefers a live event, then the latest completed event for past seasons", () => {
  assert.equal(ufcEventOptions({events: [past, {...upcoming, status: {type: {state: "in"}}}]}, Date.parse("2027-01-01")).defaultId, "2");
  assert.equal(ufcEventOptions({events: [upcoming, past]}, Date.parse("2027-01-01")).defaultId, "2");
  assert.equal(ufcEventOptions(null).defaultId, "");
});
