import * as fs from "fs";
import fetchMock from "jest-fetch-mock";
import { FileCache } from "./file-cache";

fetchMock.enableMocks();

beforeEach(() => {
  // Reset the mocks before each test
  fetchMock.resetMocks();
});

describe("get", () => {
  it("gets data from the file system", async () => {
    // Create a new FileCache instance
    const cache = new FileCache("./cache");

    // Mock the fs.promises.readFile function
    // @ts-ignore
    fs.promises.readFile = jest.fn(async () => "mock data");

    // Call the get method with a key
    const data = await cache.get("key");

    // Assert that the returned data is the same as the data returned by the mocked fs.promises.readFile function
    expect(data).toBe("mock data");

    // Assert that the fs.promises.readFile function was called with the correct arguments
    expect(fs.promises.readFile).toHaveBeenCalledWith("cache/key", "utf8");
  });

  it("gets data from the in-memory cache", async () => {
    // Create a new FileCache instance
    const cache = new FileCache("./cache");

    // Mock the fs.promises.readFile function to throw an error, so that the code will not try to read from the file system
    fs.promises.readFile = jest.fn(async () => {
      throw new Error("mock error");
    });

    fs.promises.writeFile = jest.fn();

    // Set the data in the in-memory cache using the set function
    await cache.set("key", "mock data");

    // Call the get method with the same key
    const data = await cache.get("key");

    // Assert that the returned data is the same as the data in the in-memory cache
    expect(data).toBe("mock data");

    // Assert that the fs.promises.readFile function was not called, as the data was found in the in-memory cache
    expect(fs.promises.readFile).not.toHaveBeenCalled();
  });
});

describe("set", () => {
  it("sets data on the file system", async () => {
    // Create a new FileCache instance
    const cache = new FileCache("./cache");

    // Mock the fs.promises.writeFile function
    fs.promises.writeFile = jest.fn(async () => {
      // Do nothing, the writeFile function was called as expected
    });

    // Call the set method with a key and some data
    await cache.set("key", "mock data");

    // Assert that the fs.promises.writeFile function was called with the correct arguments
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      "cache/key",
      "mock data"
    );
  });

  it("sets data on the in-memory cache", async () => {
    // Create a new FileCache instance
    const cache = new FileCache("./cache");

    // Create a spy for the Map.get method
    const getSpy = jest.spyOn(Map.prototype, "get");

    // Call the set method with a key and some data
    await cache.set("key", "mock data");

    // Call the get method with the same key
    await cache.get("key");

    // Assert that the Map.get method was called with the correct arguments
    expect(getSpy).toHaveBeenCalledWith("key");
  });

  it("handles errors when setting data on the file system", async () => {
    // Create a new FileCache instance
    const cache = new FileCache("./cache");

    // Create a spy for the Map.get method
    const getSpy = jest.spyOn(Map.prototype, "get");

    // Mock the fs.promises.writeFile function to return a rejected promise
    fs.promises.writeFile = jest.fn(async () => {
      throw new Error("mock error");
    });

    try {
      // Call the set method with a key and some data
      await cache.set("key", "mock data");
    } catch (error) {
      // Do nothing, the error was expected
    }

    // Call the get method with the same key
    await cache.get("key");

    // Assert that the Map.get method was called with the correct arguments
    expect(getSpy).toHaveBeenCalledWith("key");
  });
});
