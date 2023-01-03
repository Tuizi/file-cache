# File Cache

[![Generated with ChatGPT](https://img.shields.io/badge/generated%20with-ChatGPT-blue.svg)](https://openai.com/blog/chatgpt/)

A simple file cache system for Node.js.

## Installation

```bash
npm install @tuizi/file-cache
```

## Usage

```ts
import { FileCache } from "@tuizi/file-cache";

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

### Options

#### `ttl`

```ts
import { FileCache, Ttl } from "@tuizi/file-cache";

// Create a new FileCache instance with a time-to-live (TTL) of 1 day
const cache = new FileCache({
  ttl: 1000 * 60 * 60 * 24, // 1 day
});

// Set the value "value" for the key "key" in the cache, with a TTL of the end of the current day
await cache.set("key", "value", Ttl.endOfDay());
```
