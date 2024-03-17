import test from "ava";
import { setupLogging } from "index";

test("setupLogging can be called", (t) => {
  setupLogging();
  console.debug("Hello ava");
  t.pass();
});
