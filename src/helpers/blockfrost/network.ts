import { Network } from "lucid-cardano";

const getNetwork = (apiKey: string): string => {
  const network = apiKey.substring(0, 7);

  if (network !== "mainnet" && network !== "preview" && network !== "preprod") {
    throw new Error(`Unknown network ${network}`);
  }

  return network;
};

const getLucidNetwork = (apiKey: string): Network => {
  const network = getNetwork(apiKey);

  if (network == "mainnet") {
    return "Mainnet";
  } else if (network == "preprod") {
    return "Preprod";
  } else {
    return "Preview";
  }
};

const getCardanoNetwork = (apiKey: string): string => {
  const network = getNetwork(apiKey);

  switch (network) {
    case "mainnet":
    case "preview":
      return network;
    case "preprod":
      return "testnet";
    default:
      throw new Error(`Unknown network: ${network}`);
  }
};

export { getLucidNetwork, getNetwork, getCardanoNetwork };
