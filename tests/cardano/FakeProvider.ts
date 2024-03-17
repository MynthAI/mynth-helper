import {
  Address,
  Credential,
  Datum,
  DatumHash,
  Delegation,
  OutRef,
  PROTOCOL_PARAMETERS_DEFAULT,
  ProtocolParameters,
  Provider,
  RewardAddress,
  Transaction,
  TxHash,
  Unit,
  UTxO,
} from "lucid-cardano";

class FakeProvider implements Provider {
  async getProtocolParameters(): Promise<ProtocolParameters> {
    return PROTOCOL_PARAMETERS_DEFAULT;
  }

  async getUtxos(_addressOrCredential: Address | Credential): Promise<UTxO[]> {
    throw new Error("Not implemented");
  }

  async getUtxosWithUnit(
    _addressOrCredential: Address | Credential,
    _unit: Unit
  ): Promise<UTxO[]> {
    throw new Error("Not implemented");
  }

  async getUtxoByUnit(_unit: Unit): Promise<UTxO> {
    throw new Error("Not implemented");
  }

  async getUtxosByOutRef(_outRefs: Array<OutRef>): Promise<UTxO[]> {
    throw new Error("Not implemented");
  }

  async getDelegation(_rewardAddress: RewardAddress): Promise<Delegation> {
    throw new Error("Not implemented");
  }

  async getDatum(_datumHash: DatumHash): Promise<Datum> {
    throw new Error("Not implemented");
  }

  async awaitTx(_txHash: TxHash, _checkInterval?: number): Promise<boolean> {
    throw new Error("Not implemented");
  }

  async submitTx(_tx: Transaction): Promise<TxHash> {
    throw new Error("Not implemented");
  }
}

export { FakeProvider };
