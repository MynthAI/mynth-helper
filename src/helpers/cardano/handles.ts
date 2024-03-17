import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { invariant } from "../common/tiny-invariant.js";

const resolveAdaHandle = async (
  api: BlockFrostAPI,
  policyId: string,
  handle: string
): Promise<string> => {
  const name = handle.trim().replace(/^\$/, "");
  invariant(name, "ADA handle must not be empty");

  try {
    const assetId = policyId + Buffer.from(name).toString("hex");
    const response = await api.assetsAddresses(assetId);
    return response[0].address;
  } catch (error) {
    // Retry after adding @ to handle name
    // on-chain @ is represented as 000de140
    const assetId = policyId + "000de140" + Buffer.from(name).toString("hex");
    const response = await api.assetsAddresses(assetId);
    return response[0].address;
  }
};

export { resolveAdaHandle };
