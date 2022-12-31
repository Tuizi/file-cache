# File Cache

[![Generated with ChatGPT](https://img.shields.io/badge/generated%20with-ChatGPT-blue.svg)](https://openai.com/blog/chatgpt/)

A simple file cache system for Node.js.

## Installation

```bash
npm install @tuizi/file-cache
```

## Usage

```javascript
const FileCache = require("file-cache");

const cache = new FileCache("./cache");

// Set a key-value pair in the cache with a ttl of 1000ms
await cache.set("key", "value", { ttl: 1000 });

// Get a value from the cache
console.log(await cache.get("key"));

// The value will be removed from the cache after 1000ms
setTimeout(async () => {
  console.log(await cache.get("key"));
}, 2000);
```

## API

### `FileCache`

#### `constructor(cacheDir: string)`

Creates a new `FileCache` instance.

##### Parameters

- `cacheDir`: The directory where the cache files will be stored.

#### `set(key: string, value: any, options?: { ttl: number })`

Sets a key-value pair in the cache.

##### Parameters

- `key`: The key to set.
- `value`: The value to set.
- `options`: An optional object with the following properties:
  - `ttl`: The time to live for the cache item, in milliseconds. If not provided, the default value is 3600 (1 hour).

#### `get(key: string)`

Gets the value for a key from the cache.

##### Parameters

- `key`: The key to get.

##### Returns

The value for the key, or `undefined` if the key is not in the cache.

```

```
