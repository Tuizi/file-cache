import * as fs from "fs";

const mockFs = jest.genMockFromModule("fs") as typeof fs;

mockFs.promises = {
  ...mockFs.promises,
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
};

module.exports = mockFs;
module.exports.default = mockFs;
