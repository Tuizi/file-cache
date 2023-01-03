import { promises } from "fs";

export class FileCache {
  private readonly cachePath: string;
  private readonly cache: Map<string, string>;

  constructor(cachePath = "./cache") {
    this.cachePath = cachePath;
    this.cache = new Map<string, string>();

    // Create the cache folder if it does not exist. This is useful in case the cache folder
    // has been deleted or moved. It also ensures that the folder is present before any
    // cache operations are performed.
    promises.mkdir(this.cachePath, { recursive: true });
  }

  private getFilePath(key: string): string {
    return `${this.cachePath}/${key}`;
  }

  async set(
    key: string,
    value: string,
    options: { ttl?: number } = {}
  ): Promise<void> {
    this.cache.set(key, value);
    const filePath = this.getFilePath(key);

    await promises.writeFile(filePath, value);

    if (options.ttl) {
      setTimeout(() => {
        this.cache.delete(key);
        promises.unlink(filePath);
      }, options.ttl * 1000);
    }
  }

  async get(key: string): Promise<string | undefined> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const filePath = this.getFilePath(key);
      const value = await promises.readFile(filePath, "utf-8");

      this.cache.set(key, value);

      return value;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  async setJSON(
    key: string,
    value: any,
    options: { ttl?: number } = {}
  ): Promise<void> {
    // Convert the value to a JSON string
    const valueString = JSON.stringify(value);

    // Use the set method to store the JSON string in the cache and file system
    await this.set(key, valueString, options);
  }

  async getJSON<T>(key: string): Promise<T> {
    // Retrieve the value from the cache and file system
    const valueString = await this.get(key);

    // Convert the value string to a JavaScript object
    return valueString ? JSON.parse(valueString) : undefined;
  }
}
