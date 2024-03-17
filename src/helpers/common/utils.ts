import { exec } from "child_process";
import fs, { promises } from "fs";
import path from "path";
import appRoot from "app-root-path";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(appRoot.path, "package.json"), "utf-8")
);

const runCommand = async (command: string): Promise<string> => {
  return await new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stderr) console.error("stderr", stderr);

      if (error) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
};

const fileExists = async (path: string) => {
  try {
    await promises.access(path);
    return true;
  } catch {
    return false;
  }
};

export { fileExists, packageJson, runCommand };
