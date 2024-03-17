import test from "ava";
import config from "config";
import { getAddressFromSeed, getLucid, getPrivateKeyFromSeed } from "index";
import { generatePrivateKey } from "lucid-cardano";

test("getPrivateKeyFromSeed can sign transactions", async (t) => {
  const blockfrostKey = config.get<string>("blockfrost.preview");
  const seed = config.get<string>("wallets.integration");

  const destination =
    "addr_test1qzvm9w204t9355j87uujdscap5qhvgfx3fmx6vpclczuqewdzkdtk0zv0mpv3tlnlq5xgvyuupef2ldppwgmrqjr8rgsfarnxl";

  const signingWallet = await getLucid(blockfrostKey);
  signingWallet.selectWalletFromSeed(seed);
  const utxos = await signingWallet.wallet.getUtxos();

  const lucid = await getLucid(blockfrostKey);
  lucid.selectWalletFrom({
    address: getAddressFromSeed(seed, "testnet"),
    utxos: utxos,
  });

  const createTx = async () => {
    return await lucid
      .newTx()
      .payToAddress(destination, { lovelace: 50000000n })
      .complete();
  };

  // Assert that a random key cannot sign transaction
  let tx = await createTx();
  let signedTx = await tx.signWithPrivateKey(generatePrivateKey()).complete();
  await t.throwsAsync(signedTx.submit);

  // Assert that generated private key can sign transaction
  tx = await createTx();
  const signingKey = getPrivateKeyFromSeed(seed);
  signedTx = await tx.signWithPrivateKey(signingKey).complete();
  await signedTx.submit();
});
