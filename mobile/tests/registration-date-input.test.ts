import { describe, expect, it } from "vitest";

import { formatIsoDateForInput, maskIndonesianDateInput, parseIndonesianDateInput } from "../src/lib/date-input";

describe("registration date input", () => {
  it.each([
    ["10021977", "1977-02-10"],
    ["10-02-1977", "1977-02-10"],
    ["10/02/1977", "1977-02-10"],
    ["1977-02-10", "1977-02-10"],
  ])("parses %s into ISO", (input, expected) => {
    expect(parseIndonesianDateInput(input)).toBe(expected);
  });

  it("rejects impossible calendar dates", () => {
    expect(parseIndonesianDateInput("31-02-1977")).toBeNull();
    expect(parseIndonesianDateInput("29022023")).toBeNull();
  });

  it("masks digits and formats stored ISO values for the web field", () => {
    expect(maskIndonesianDateInput("10021977")).toBe("10-02-1977");
    expect(formatIsoDateForInput("1977-02-10")).toBe("10-02-1977");
  });
});
