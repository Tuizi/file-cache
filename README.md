# File Cache

[![Generated with ChatGPT](https://img.shields.io/badge/generated%20with-ChatGPT-blue.svg)](https://openai.com/blog/chatgpt/)

A simple file cache system for Node.js.

## Installation

```bash
npm install @tuizi/file-cache
```

## Usage

```ts
import { FileCache } from "./file-cache";

const cache = new FileCache();

// Store a string value in the cache and file system
await cache.set("key", "value");

// Retrieve the value from the cache and file system
const value = await cache.get("key");

// Store a JSON value in the cache and file system
await cache.setJSON("key", { foo: "bar" });

// Retrieve the JSON value from the cache and file system
const jsonValue = await cache.getJSON("key");
```

## API

### `new FileCache(cachePath?: string)`

Creates a new `FileCache` instance.

##### Parameters

- `cachePath?: string`: Optional path to the cache directory. Defaults to `./cache`.

---

### `set(key: string, value: string, options?: { ttl?: number }): Promise<void>`

Stores a value in the cache and file system.

##### Parameters

- `key: string`: Key of the value to be stored.
- `value: string`: Value to be stored.
- `options?: { ttl?: number }`: Optional object with the following properties:
  - `ttl?: number`: Time-to-live in seconds. If set, the value will be deleted from the cache and file system after the specified number of seconds.

##### Returns

- `Promise<void>`: A promise that resolves when the value has been stored.

---

### `get(key: string): Promise<string | undefined>`

Retrieves a value from the cache and file system.

##### Parameters

- `key: string`: Key of the value to be retrieved.

##### Returns

- `Promise<string | undefined>`: A promise that resolves with the value if it exists, or `undefined` if the value does not exist or has expired.

---

### `setJSON(key: string, value: any, options?: { ttl?: number }): Promise<void>`

Stores a JSON-serializable value in the cache and file system.

##### Parameters

- `key: string`: Key of the value to be stored.
- `value: any`: JSON-serializable value to be stored.
- `options?: { ttl?: number }`: Optional object with the following properties:
  - `ttl?: number`: Time-to-live in seconds. If set, the value will be deleted from the cache and file system after the specified number of seconds.

##### Returns

- `Promise<void>`: A promise that resolves when the value has been stored.

### `getJSON(key: string): Promise<any | undefined>`

Retrieves a JSON-serializable value from the cache and file system.

##### Parameters

- `key: string`: Key of the value to be retrieved.

##### Returns

- `Promise<any | undefined>`: A promise that resolves with the value if it exists and is a valid JSON string, or `undefined` if the value does not exist, has expired, or is not a valid JSON string.
