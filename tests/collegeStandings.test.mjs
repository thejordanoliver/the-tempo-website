import test from "node:test";
import assert from "node:assert/strict";
import { collegeStandingsOptions } from "../src/collegeStandings.js";
const ap = {type: "ap", ranks: [{current: 1}]};
const coaches = {type: "coaches", ranks: [{current: 1}]};
const cfp = {type: "cfp", ranks: [{current: 1}]};
const data = {conferences: [{id: 23, name: "Southeastern Conference", shortName: "SEC", divisions: []}, {id: 1, name: "ACC", divisions: []}]};
test("AP Top 25 is the default with coaches and individual conferences available", () => {
  const {options, defaultValue} = collegeStandingsOptions(data, {rankings: [coaches, ap]}, "cfb");
  assert.equal(options.find(option => option.value === defaultValue).label, "AP Top 25");
  for (const label of ["Coaches Poll", "SEC", "ACC", "All conferences"]) assert(options.some(option => option.label === label));
});
test("released CFP rankings take priority while empty CFP placeholders do not", () => {
  for (const ranks of [[], [{current: 1}]]) {
    const {options, defaultValue} = collegeStandingsOptions(data, {rankings: [ap, {...cfp, ranks}]}, "cfb");
    assert.equal(options.find(option => option.value === defaultValue).type, ranks.length ? "cfp" : "ap");
  }
});
test("basketball defaults to AP and missing polls leave conference standings available", () => {
  assert.equal(collegeStandingsOptions(data, {rankings: [coaches, ap]}, "mcbb").defaultValue, "poll:1");
  assert.equal(collegeStandingsOptions(data, null, "cfb").defaultValue, "conferences");
});
test("volleyball supports its AVCA polls and conference groups", () => {
  const {options, defaultValue} = collegeStandingsOptions({groups: [{name: "NCAA", children: [{name: "SEC", standings: [{team: {id: 57}}]}]}]}, {rankings: {all: [{name: "AVCA Top 25", ranks: [{current: 1}]}]}}, "wcvb");
  assert.equal(defaultValue, "poll:0");
  assert(options.some(option => option.label === "SEC"));
});
