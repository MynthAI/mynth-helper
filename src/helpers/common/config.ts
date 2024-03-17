import path from "path";
import appRoot from "app-root-path";
import config from "config";
import { parse } from "yaml";
import { getNetwork } from "../blockfrost/index.js";
import { fileExists, runCommand } from "./utils.js";

const getEnvConfig = <T>(
  name: string,
  blockfrostKey: string = "blockfrost"
): T => {
  const network = getNetwork(config.get<string>(`${blockfrostKey}`));
  return config.get<T>(`${network}.${name}`);
};

const Config = (() => {
  const originalConfigGet = config.get;
  let newConfig = config.util.loadFileConfigs();

  config.get = function <T>(arg: string): T {
    return originalConfigGet.call(newConfig, arg) as T;
  };

  const overrideConfig = (override: Record<string, string | object>) => {
    config.util.extendDeep(newConfig, override);
  };

  const reloadConfig = (override: Record<string, string | object>) => {
    newConfig = config.util.loadFileConfigs();
    config.util.extendDeep(newConfig, override);
  };

  return { overrideConfig, reloadConfig };
})();

const overrideConfig = Config.overrideConfig;
const reloadConfig = Config.reloadConfig;

const loadVaultConfig = async (name: string = "local.yml") => {
  if (await fileExists(path.join(appRoot.path, `config/${name}`))) return;

  const template = path.join(appRoot.path, `config/${name}.j2`);
  const data = await runCommand(`vault-cli template ${template}`);
  reloadConfig(parse(data));
};

export { getEnvConfig, loadVaultConfig, overrideConfig, reloadConfig };
