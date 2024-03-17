import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import Decimal from "decimal.js";
import { invariant } from "../common/tiny-invariant.js";

type Pool = {
  lovelace: string;
  lpTokens: string;
  token: string;
};

type Balance = {
  unit: string;
};

async function getPool(
  api: BlockFrostAPI,
  poolId: string,
  assetId: string,
  lpTokenId: string
): Promise<Pool> {
  const transactions = await api.assetsTransactions(poolId, { order: "desc" });
  const txHash = transactions[0].tx_hash;

  const utxos = await api.txsUtxos(txHash);
  const output = utxos.outputs.find((o) =>
    o.amount.some((amount: Balance) => amount.unit === poolId)
  );

  invariant(output, "output is missing");

  const lovelace = (() => {
    const value = output.amount.find((o) => o.unit === "lovelace")?.quantity;
    invariant(value, "lovelace is missing from output");
    return value;
  })();

  const asset = (() => {
    const value = output.amount.find((o) => o.unit === assetId)?.quantity;
    invariant(value, "asset is missing from output");
    return value;
  })();

  const lpToken = await api.assetsById(lpTokenId);

  return {
    lovelace: lovelace,
    lpTokens: lpToken.quantity,
    token: asset,
  };
}

const getMntAmount = (
  pool: Pool,
  adaAmount: Decimal,
  assetDecimals: number
): Decimal => {
  const price = new Decimal(pool.lovelace).div(pool.token);
  const mntAmount = adaAmount.div(price);
  return mntAmount.toDecimalPlaces(assetDecimals);
};

export { getPool, getMntAmount };
