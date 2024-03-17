import test from "ava";
import config from "config";
import { convertDatum, getLucid } from "index";
import { Address, Data, fromText, SpendingValidator } from "lucid-cardano";
import { invariant } from "../../src/helpers/common";

const getWallet = async () => {
  const blockfrostKey = config.get<string>("blockfrost.preview");
  const seed = config.get<string>("wallets.integration");
  const lucid = await getLucid(blockfrostKey);
  lucid.selectWalletFromSeed(seed);

  return lucid;
};

test("empty data can be converted correctly", async (t) => {
  const lucid = await getWallet();

  const alwaysSucceedScript: SpendingValidator = {
    type: "PlutusV2",
    script: "49480100002221200101",
  };
  const alwaysSucceedAddress: Address =
    lucid.utils.validatorToAddress(alwaysSucceedScript);

  const tx = await lucid
    .newTx()
    .payToContract(
      alwaysSucceedAddress,
      { inline: Data.void() },
      { lovelace: 1000000n }
    )
    .payToContract(
      alwaysSucceedAddress,
      {
        asHash: Data.void(),
        scriptRef: alwaysSucceedScript,
      },
      {}
    )
    .complete();

  const signedTx = await tx.sign().complete();
  const datum = signedTx.txSigned.body().outputs().get(0).datum();
  invariant(datum);

  t.is(convertDatum(datum).datum, Data.void());
});

test("custom datum can be convered", async (t) => {
  const MyDatumSchema = Data.Object({
    name: Data.Bytes(),
    age: Data.Integer(),
    colors: Data.Array(Data.Bytes()),
    description: Data.Nullable(Data.Bytes()),
  });
  const MyDatum = MyDatumSchema as unknown as Data.Static<typeof MyDatumSchema>;

  const lucid = await getWallet();

  const tx = await lucid
    .newTx()
    .payToAddressWithData(
      await lucid.wallet.address(),
      Data.to(
        {
          name: fromText("Lucid"),
          age: 0n,
          colors: [fromText("Blue"), fromText("Purple")],
          description: null,
        },
        MyDatum
      ),
      { lovelace: 5000000n }
    )
    .complete();

  const signed = await tx.sign().complete();
  const txDatum = signed.txSigned.body().outputs().get(0).datum();
  invariant(txDatum);

  t.is(
    convertDatum(txDatum).datumHash,
    "4d48b7f47916b94ad6bf298329f09d9e0d74448e75a5232b57457e70de4dcb6b"
  );
});
