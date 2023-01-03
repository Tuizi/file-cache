import * as fs from "fs";

/**
 * A class for storing key-value pairs in a cache and on the file system.
 */
export class FileCache {
  /**
   * The path to the cache folder.
   */
  private readonly cachePath: string;
  /**
   * A map for storing key-value pairs in memory.
   */
  private readonly cache: Map<string, string>;

  /**
   * Creates a new FileCache instance.
   * @param cachePath The path to the cache folder. Defaults to "./cache".
   */
  constructor(cachePath = "./cache") {
    this.cachePath = cachePath;
    this.cache = new Map<string, string>();

    // Create the cache folder if it does not exist. This is useful in case the cache folder
    // has been deleted or moved. It also ensures that the folder is present before any
    // cache operations are performed.
    fs.promises.mkdir(this.cachePath, { recursive: true });
  }

  /**
   * Returns the file path for the given key.
   * @param key The key.
   * @returns The file path.
   */
  private getFilePath(key: string): string {
    return `${this.cachePath}/${key}`;
  }

  /**
   * Stores the given value in the cache and on the file system.
   * @param key The key.
   * @param value The value.
   * @param options An options object.
   * @param options.ttl The time to live for the key-value pair in seconds. The value will be deleted from the cache and file system after this time.
   * @returns A promise that resolves when the value has been stored.
   */
  async set(
    key: string,
    value: string,
    options: { ttl?: number } = {}
  ): Promise<void> {
    this.cache.set(key, value);
    const filePath = this.getFilePath(key);

    await fs.promises.writeFile(filePath, value);

    if (options.ttl) {
      setTimeout(() => {
        this.cache.delete(key);
        fs.promises.unlink(filePath);
      }, options.ttl * 1000);
    }
  }

  /**
   * Retrieves the value for the given key from the cache and file system.
   * @param key The key.
   * @returns The value, or undefined if the key is not found.
   */
  async get(key: string): Promise<string | undefined> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const filePath = this.getFilePath(key);
      const value = await fs.promises.readFile(filePath, "utf-8");

      this.cache.set(key, value);

      return value;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * Stores the given value in the cache and on the file system as a JSON string.
   * @param key The key.
   * @param value The value.
   * @param options An options object.
   * @param options.ttl The time to live for the key-value pair in seconds. The value will be deleted from the cache and file system after this time.
   * @returns A promise that resolves when the value has been stored.
   */
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

  /**
   * Retrieves the value for the given key from the cache and file system and parses it as a JSON object.
   * @param key The key.
   * @returns The parsed value, or undefined if the key is not found.
   */
  async getJSON<T>(key: string): Promise<T> {
    // Retrieve the value from the cache and file system
    const valueString = await this.get(key);

    // Convert the value string to a JavaScript object
    return valueString ? JSON.parse(valueString) : undefined;
  }
}
