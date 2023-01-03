import * as fs from "fs";
import { FileCache } from "./file-cache";

jest.useFakeTimers();
jest.mock("fs");

describe("set/get string", () => {
  const cachePath = "./cache";
  let cache: FileCache;

  beforeEach(() => {
    cache = new FileCache(cachePath);
  });

  it("should set value in cache and file system", async () => {
    await cache.set("key", "value");

    expect(await cache.get("key")).toBe("value");
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      `${cachePath}/key`,
      "value"
    );
  });

  it("should set value in cache and file system with ttl", async () => {
    const ttl = 1;
    await cache.set("key", "value", { ttl });

    expect(await cache.get("key")).toBe("value");
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      `${cachePath}/key`,
      "value"
    );

    jest.advanceTimersByTime(ttl * 1000);

    expect(await cache.get("key")).toBeUndefined();
    expect(fs.promises.unlink).toHaveBeenCalledWith(`${cachePath}/key`);
  });

  it("should overwrite existing value in cache and file system", async () => {
    jest.mocked(fs.promises.writeFile).mockResolvedValue(undefined);

    await cache.set("key", "old-value");
    await cache.set("key", "new-value");

    expect(await cache.get("key")).toBe("new-value");
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      `${cachePath}/key`,
      "new-value"
    );
  });
});

describe("get/set JSON", () => {
  const cachePath = "./cache-json";
  let cache: FileCache;

  beforeEach(() => {
    cache = new FileCache(cachePath);
  });

  it("should return undefined for non-existent key", async () => {
    expect(await cache.getJSON("non-existent-key")).toBeUndefined();
  });

  it("should return JSON value for key", async () => {
    const value = { foo: "bar" };
    await cache.setJSON("key", value);
    expect(await cache.getJSON("key")).toEqual(value);
  });

  it("should return undefined for expired key", async () => {
    const ttl = 1;
    await cache.setJSON("key", { foo: "bar" }, { ttl });

    jest.advanceTimersByTime(ttl * 1000);

    expect(await cache.getJSON("key")).toBeUndefined();
  });
});
