import { endOfDay, days, hours, minutes } from "./ttl";

describe("endOfDay", () => {
  it("should return the number of seconds until the end of the current day", () => {
    const now = new Date();
    const endOfDayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    const expected = Math.round(
      (endOfDayDate.getTime() - now.getTime()) / 1000
    );
    expect(endOfDay()).toEqual(expected);
  });
});

describe("days", () => {
  it("should return the number of seconds in the given number of days", () => {
    expect(days(1)).toEqual(86400);
    expect(days(2)).toEqual(172800);
  });
});

describe("hours", () => {
  it("should return the number of seconds in the given number of hours", () => {
    expect(hours(1)).toEqual(3600);
    expect(hours(2)).toEqual(7200);
  });
});

describe("minutes", () => {
  it("should return the number of seconds in the given number of minutes", () => {
    expect(minutes(1)).toEqual(60);
    expect(minutes(2)).toEqual(120);
  });
});
