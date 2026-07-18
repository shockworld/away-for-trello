import test from "node:test";
import assert from "node:assert/strict";
import { formatDate, isActive, localDateKey, normalizeStatus } from "../js/status.js";

test("an enabled status without dates is active", () => {
  assert.equal(isActive({ enabled: true, person: "Miki" }, new Date(2026, 6, 20)), true);
});

test("a status begins on its start date", () => {
  const status = { enabled: true, startDate: "2026-07-20", returnDate: "2026-07-27" };
  assert.equal(isActive(status, new Date(2026, 6, 19, 23)), false);
  assert.equal(isActive(status, new Date(2026, 6, 20, 0)), true);
});

test("a status expires at the start of the return date", () => {
  const status = { enabled: true, startDate: "2026-07-20", returnDate: "2026-07-27" };
  assert.equal(isActive(status, new Date(2026, 6, 26, 23, 59)), true);
  assert.equal(isActive(status, new Date(2026, 6, 27, 0)), false);
});

test("normalization trims and limits user content", () => {
  const value = normalizeStatus({ enabled: true, person: `  ${"x".repeat(100)}  `, type: "unknown" });
  assert.equal(value.person.length, 80);
  assert.equal(value.type, "vacation");
});

test("existing notices default to all cards", () => {
  assert.equal(normalizeStatus({ enabled: true, person: "Miki" }).cardScope, "all");
});

test("local date keys do not use UTC conversion", () => {
  assert.equal(localDateKey(new Date(2026, 0, 2, 1)), "2026-01-02");
});

test("date formatting accepts ISO date keys", () => {
  assert.match(formatDate("2026-07-27", "en"), /July 27, 2026/);
  assert.equal(formatDate("invalid", "en"), "");
});
