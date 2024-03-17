import { Blockfrost, Lucid } from "lucid-cardano";
import { getLucidNetwork, getNetwork } from "../blockfrost/index.js";

const getLucid = async (blockfrostApiKey: string): Promise<Lucid> => {
  const network = getNetwork(blockfrostApiKey);
  return await Lucid.new(
    new Blockfrost(
      `https://cardano-${network}.blockfrost.io/api/v0`,
      blockfrostApiKey
    ),
    getLucidNetwork(blockfrostApiKey)
  );
};

export { getLucid };
