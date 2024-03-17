import { C } from "lucid-cardano";
import { invariant } from "../common/tiny-invariant.js";

const getStakeKey = (address: string): string => {
  const cAddress = C.Address.from_bech32(address);
  invariant(cAddress, `${address} is invalid`);

  const baseAddress = cAddress.as_base();
  invariant(baseAddress, `${address} is invalid`);

  const prefix =
    parseInt(baseAddress.payment_cred().kind() === 0 ? "e" : "f", 16) << 4;

  const stakeAddressBytes = new Uint8Array(29);
  stakeAddressBytes.set([prefix + cAddress.network_id()], 0);
  stakeAddressBytes.set(baseAddress.stake_cred().to_bytes().slice(4, 32), 1);

  const stakeAddress = C.Address.from_bytes(stakeAddressBytes);
  invariant(stakeAddress, `${address} is invalid`);

  const rewardAddress = C.RewardAddress.from_address(stakeAddress);
  invariant(rewardAddress, `${address} is invalid`);

  return rewardAddress.to_address().to_bech32(undefined);
};

export { getStakeKey };
