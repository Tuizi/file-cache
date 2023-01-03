const promises = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
};

export { promises };
