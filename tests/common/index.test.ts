import test from "ava";
import { getEnvConfig, packageJson, reloadConfig } from "index";

test("getEnvConfig preview", (t) => {
  reloadConfig({
    blockfrost: "previewb04d05e9e68a7f91a119700493c6417c",
    preview: {
      subitem: "expectedvalue",
    },
  });
  t.is(getEnvConfig("subitem"), "expectedvalue");
});

test("getEnvConfig mainnet", (t) => {
  reloadConfig({
    blockfrost: "mainnet9cc1831609aac2797550e4bddd69c84b",
    mainnet: {
      subitem: {
        subsubitem: "anotherexpectedvalue",
      },
    },
  });
  t.is(getEnvConfig("subitem.subsubitem"), "anotherexpectedvalue");
});

test("getEnvConfig override blockfrost key", (t) => {
  reloadConfig({
    bf: {
      api: {
        key: "preview0bb9e081752d0c51c7489f7ce3cf5470",
      },
    },
    preview: {
      subitem: "expectedvalue",
    },
  });
  t.is(getEnvConfig("subitem", "bf.api.key"), "expectedvalue");
});

test("packageJson returns name", (t) => {
  t.is(packageJson.name, "mynth-helper");
});
