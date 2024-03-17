import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { C } from "lucid-cardano";

const getBlockfrostApi = (apiKey: string): BlockFrostAPI => {
  return new BlockFrostAPI({ projectId: apiKey });
};

const getCoinsPerUtxoByte = async (blockfrost: BlockFrostAPI) => {
  const params = await blockfrost.epochsLatestParameters();
  const coinsPerUtxoByteParam = params.coins_per_utxo_size
    ? BigInt(params.coins_per_utxo_size)
    : BigInt(4310);
  return C.BigNum.from_str(coinsPerUtxoByteParam.toString());
};

export { getBlockfrostApi, getCoinsPerUtxoByte };
