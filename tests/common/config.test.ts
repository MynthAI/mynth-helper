import test from "ava";
import config from "config";
import { loadVaultConfig, overrideConfig, reloadConfig } from "index";

test("config is reloaded", (t) => {
  t.is(config.get("secret"), "4a72ff1fab93287fb9f741e9412f1677");
  t.truthy(config.get("blockfrost.mainnet"));
  reloadConfig({ secret: "test" });
  t.is(config.get("secret"), "test");
  t.throws(() => config.get("blockfrost.mainnet"));
});

test("config is overridden", async (t) => {
  await loadVaultConfig();
  t.is(config.get("secret"), "4a72ff1fab93287fb9f741e9412f1677");
  t.truthy(config.get("blockfrost.mainnet"));
  const blockfrost = config.get("blockfrost.mainnet");
  overrideConfig({ secret: "test" });
  t.is(config.get("secret"), "test");
  t.is(config.get("blockfrost.mainnet"), blockfrost);
});
