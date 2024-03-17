import { mnemonicToEntropy } from "bip39";
import { C, fromHex } from "lucid-cardano";

type Network = "mainnet" | "testnet";

const getAccountKeyFromSeed = (seed: string) => {
  const entropy = mnemonicToEntropy(seed);
  const rootKey = C.Bip32PrivateKey.from_bip39_entropy(
    fromHex(entropy),
    new Uint8Array()
  );

  return rootKey.derive(2147485500).derive(2147485463).derive(2147483648);
};

const getAddressFromSeed = (
  seed: string,
  network: Network = "mainnet"
): string => {
  const accountKey = getAccountKeyFromSeed(seed);
  const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
  const stakeKey = accountKey.derive(2).derive(0).to_raw_key();
  const paymentKeyHash = paymentKey.to_public().hash();
  const stakeKeyHash = stakeKey.to_public().hash();

  return C.BaseAddress.new(
    network == "mainnet" ? 1 : 0,
    C.StakeCredential.from_keyhash(paymentKeyHash),
    C.StakeCredential.from_keyhash(stakeKeyHash)
  )
    .to_address()
    .to_bech32(undefined);
};

const getPrivateKeyFromSeed = (seed: string): string => {
  const accountKey = getAccountKeyFromSeed(seed);
  return accountKey.derive(0).derive(0).to_raw_key().to_bech32();
};

export { getAddressFromSeed, getPrivateKeyFromSeed };
