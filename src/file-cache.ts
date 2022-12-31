import * as fs from "fs";
import * as path from "path";

export class FileCache {
  private readonly cachePath: string;
  private readonly cache: Map<string, string>;

  constructor(cachePath: string) {
    this.cachePath = cachePath;
    this.cache = new Map<string, string>();
  }

  async get(key: string): Promise<string | undefined> {
    // Check the in-memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    console.debug(`Cache miss for key "${key}"`);

    // If the key is not in the in-memory cache, try reading it from the file system
    const filePath = path.join(this.cachePath, key);
    try {
      const data = await fs.promises.readFile(filePath, "utf8");

      // If the data was found on the file system, store it in the in-memory cache
      this.cache.set(key, data);
      return data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  async getJSON<T>(key: string): Promise<T | undefined> {
    const data = await this.get(key);
    if (data === undefined) {
      return undefined;
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to parse JSON data for key "${key}"`);
    }
  }

  async set(
    key: string,
    value: string,
    options: { ttl?: number } = {}
  ): Promise<void> {
    // Store the value in the in-memory cache
    this.cache.set(key, value);

    // Write the value to the file system
    const filePath = path.join(this.cachePath, key);
    await fs.promises.writeFile(filePath, value);

    // Set a timeout to delete the cache file if a TTL is specified
    if (options.ttl) {
      setTimeout(() => {
        fs.promises.unlink(filePath);
      }, options.ttl);
    }
  }

  async setJSON<T>(
    key: string,
    value: T,
    options: { ttl?: number } = {}
  ): Promise<void> {
    const data = JSON.stringify(value);
    return this.set(key, data, options);
  }
}
