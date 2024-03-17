import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import util from "util";

const getDirname = (calledFrom: string) => dirname(fileURLToPath(calledFrom));

const readFile = util.promisify(fs.readFile);

const readFilePath = async (...paths: string[]): Promise<string> => {
  return await readFile(path.join(...paths), "utf8");
};

export { getDirname, readFile, readFilePath };
