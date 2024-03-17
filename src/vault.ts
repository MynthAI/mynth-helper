import { promises } from "fs";
import { fileExists, packageJson } from ".";
import { invariant } from "./helpers/common/tiny-invariant.js";

const loadSecrets = () => {
  invariant(process.env.SECRETS_CONTEXT, "SECRETS_CONTEXT is missing");

  const context = JSON.parse(process.env.SECRETS_CONTEXT);
  const secrets: Record<string, string> = {};
  const { name } = packageJson;

  Object.keys(context).forEach((key) => {
    const [path, field] = key.toLowerCase().split("__");

    if (path && field) {
      secrets[`{{ vault('${name}/${path.replace("_", "/")}').${field} }}`] =
        context[key];
    } else if (path) {
      secrets[`{{ vault('${name}/${path.replace("_", "/")}') }}`] =
        context[key];
    }
  });

  return secrets;
};

const run = async () => {
  const secrets = loadSecrets();
  const file = process.argv[3];
  invariant(file, "Missing file argument");
  invariant(await fileExists(file), `Template doesn't exist: ${file}`);

  const template = Object.keys(secrets).reduce((data, key) => {
    return data.replace(key, secrets[key]);
  }, await promises.readFile(file, "utf8"));

  console.log(template);
};

run();
