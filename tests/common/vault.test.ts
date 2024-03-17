import test from "ava";
import config from "config";

test("can load secret", (t) => {
  t.is(config.get("secret"), "4a72ff1fab93287fb9f741e9412f1677");
});
