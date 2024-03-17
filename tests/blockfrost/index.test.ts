import test from "ava";
import { getCardanoNetwork, getLucidNetwork, getNetwork } from "index";

test("getLucidNetwork returns Mainnet", (t) => {
  t.is(getLucidNetwork("mainnet29d9c374b446614df22395fa435cca20"), "Mainnet");
});

test("getLucidNetwork returns Preview", (t) => {
  t.is(getLucidNetwork("previewfa4b94fc7158b77e67b7bcc0b7428597"), "Preview");
});

test("getLucidNetwork returns Preprod", (t) => {
  t.is(getLucidNetwork("preprodfc361d8107bfdfe54065a18ddf1944a3"), "Preprod");
});

test("getLucidNetwork throws error when key invalid", (t) => {
  t.throws(() => {
    getLucidNetwork("customy778357aac92fe1eea0909729931c78ed");
  });
});

test("getNetwork returns mainnet", (t) => {
  t.is(getNetwork("mainnet54c26d9790998e7983a06c8ff1e51a96"), "mainnet");
});

test("getNetwork returns preview", (t) => {
  t.is(getNetwork("preview8c33ef8e36439d60236b4fdf6d558c60"), "preview");
});

test("getNetwork returns preprod", (t) => {
  t.is(getNetwork("preprodfcd5e51b6b846e772a45520ef7168ab862"), "preprod");
});

test("getNetwork throws error when key invalid", (t) => {
  t.throws(() => {
    getNetwork("this is not a key");
  });
});

test("getCardanoNetwork returns mainnet", (t) => {
  t.is(getCardanoNetwork("mainnet29d9c374b446614df22395fa435cca20"), "mainnet");
});

test("getCardanoNetwork returns preview", (t) => {
  t.is(getCardanoNetwork("previewfa4b94fc7158b77e67b7bcc0b7428597"), "preview");
});

test("getCardanoNetwork returns testnet", (t) => {
  t.is(getCardanoNetwork("preprodfc361d8107bfdfe54065a18ddf1944a3"), "testnet");
});

test("getCardanoNetwork throws error when key invalid", (t) => {
  t.throws(() => {
    getCardanoNetwork("customy778357aac92fe1eea0909729931c78ed");
  });
});
