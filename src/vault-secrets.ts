import { execSync } from "child_process";
import { invariant } from "./helpers/common/tiny-invariant.js";

const loadSecrets = () => {
  invariant(process.env.SECRETS_CONTEXT, "SECRETS_CONTEXT is missing");
  invariant(process.argv[2], "name is missing");

  const context = JSON.parse(process.env.SECRETS_CONTEXT);
  const secrets: Record<string, string> = {};
  const name = process.argv[2];

  Object.keys(context).forEach((key) => {
    const [path, field] = key.toLowerCase().split("__");

    if (path && field) {
      secrets[`${name}/${path.replace(/_/g, "/")} ${field}`] = context[key];
    }
  });

  return secrets;
};

const run = async () => {
  const secrets = loadSecrets();
  const token = execSync("docker exec vault token", {
    encoding: "utf-8",
  }).trim();

  for (const name in secrets) {
    const value = secrets[name];
    execSync(`vault-cli set ${name}="${value}"`, {
      stdio: "inherit",
      env: { VAULT_CLI_TOKEN: token },
    });
  }
};

run();
