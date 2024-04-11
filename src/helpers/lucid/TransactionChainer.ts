import { Assets, C, Lucid, Script, TxSigned, UTxO } from "lucid-cardano";
import { getPrivateKeyFromSeed } from "../cardano/wallet.js";
import { invariant } from "../common/tiny-invariant.js";
import { convertDatum } from "./datum.js";
import { getLucid } from "./lucid.js";

class TransactionChainer {
  private blockfrostApiKey: string;
  private address: string;
  private utxos: Record<string, UTxO[]>;
  private lucids: Record<string, Lucid | null> = {};
  private txs: TxSigned[] = [];
  private keys: Record<string, string> = {};

  constructor(
    blockfrostApiKey: string,
    address: string,
    utxos: UTxO[],
    seed?: string
  ) {
    this.blockfrostApiKey = blockfrostApiKey;
    this.address = address;
    this.utxos = { [address]: utxos };
    if (seed) this.keys[address] = getPrivateKeyFromSeed(seed);
  }

  public static async loadWallet(
    blockfrostApiKey: string,
    seed: string
  ): Promise<TransactionChainer> {
    const lucid = await getLucid(blockfrostApiKey);
    lucid.selectWalletFromSeed(seed);

    const [address, utxos] = await Promise.all([
      lucid.wallet.address(),
      lucid.wallet.getUtxos(),
    ]);

    return new TransactionChainer(blockfrostApiKey, address, utxos, seed);
  }

  public async registerAddress(address: string) {
    const lucid = await getLucid(this.blockfrostApiKey);
    lucid.selectWalletFrom({ address });

    this.utxos[address] = await lucid.wallet.getUtxos();
  }

  public async registerWallet(address: string, seed: string) {
    await this.registerAddress(address);
    this.keys[address] = getPrivateKeyFromSeed(seed);
  }

  public async getLucid(address?: string): Promise<Lucid> {
    address = address || this.address;

    if (!(address in this.lucids)) {
      this.lucids[address] = await getLucid(this.blockfrostApiKey);
      this.setupLucid(address);
    }

    const lucid = this.lucids[address];
    invariant(lucid);
    return lucid;
  }

  private setupLucid(address: string) {
    if (!(address in this.lucids) || !this.lucids[address]) return;

    const lucid = this.lucids[address];
    invariant(lucid);
    lucid.selectWalletFrom({
      address,
      utxos: this.utxos[address],
    });

    if (address in this.keys) {
      const key = this.keys[address];

      lucid.wallet.signTx = async (tx: C.Transaction) => {
        const priv = C.PrivateKey.from_bech32(key);
        const witness = C.make_vkey_witness(
          C.hash_transaction(tx.body()),
          priv
        );
        const txWitnessSetBuilder = C.TransactionWitnessSetBuilder.new();
        txWitnessSetBuilder.add_vkey(witness);
        return txWitnessSetBuilder.build();
      };
    }
  }

  public registerTx(tx: TxSigned, registerOutputs: boolean = true) {
    for (const utxo of tx.txSigned.to_js_value().body.inputs) {
      this.spendUtxo(utxo.transaction_id, utxo.index);
    }

    registerOutputs && this.registerOutputs(tx);
    this.txs.push(tx);

    for (const address in this.utxos) {
      this.setupLucid(address);
    }
  }

  private registerOutputs(tx: TxSigned) {
    let index = 0;
    const outputs = tx.txSigned.body().outputs();

    for (let i = 0; i < outputs.len(); i++) {
      const utxo = outputs.get(i);
      const { address, amount, script_ref } = utxo.to_js_value();

      if (!(address in this.utxos)) continue;

      const cdatum = utxo.datum();
      const datum = cdatum ? convertDatum(cdatum) : {};
      const assets: Assets = { lovelace: BigInt(amount.coin) };
      const multiasset = amount.multiasset || {};
      const scriptRef: Script | null =
        script_ref && "PlutusScriptV2" in script_ref
          ? {
              type: "PlutusV2",
              script: script_ref.PlutusScriptV2,
            }
          : null;

      for (const key in multiasset) {
        for (const innerKey of Object.keys(multiasset[key])) {
          const innerValue = multiasset[key][innerKey];
          assets[key + innerKey] = BigInt(innerValue);
        }
      }

      this.utxos[address].push({
        txHash: tx.toHash(),
        outputIndex: index,
        assets,
        address,
        ...datum,
        scriptRef,
      });
      index++;
    }
  }

  public getUtxo(txHash: string, index: number = 0): UTxO {
    for (const address in this.utxos) {
      for (const utxo of this.utxos[address]) {
        if (utxo.txHash == txHash && utxo.outputIndex == index) {
          return utxo;
        }
      }
    }

    throw new Error(`Could not find ${txHash}#${index}`);
  }

  public getUtxosForTx(txHash: string): UTxO[] {
    const allUtxos = [];

    for (const address in this.utxos) {
      for (const utxo of this.utxos[address]) {
        if (utxo.txHash == txHash) {
          allUtxos.push(utxo);
        }
      }
    }

    return allUtxos;
  }

  public spendUtxo(txHash: string, index: number) {
    for (const address in this.utxos) {
      for (let i = 0; i < this.utxos[address].length; i++) {
        if (
          this.utxos[address][i].txHash == txHash &&
          this.utxos[address][i].outputIndex == index
        ) {
          this.utxos[address].splice(i, 1);
          return;
        }
      }
    }

    throw new Error(`Could not find ${txHash}#${index}`);
  }

  public getUtxos(address?: string): UTxO[] {
    return this.utxos[address || this.address];
  }

  public async submit() {
    for (const tx of this.txs) {
      await tx.submit();
    }

    this.txs.splice(0, this.txs.length);
  }
}

export { TransactionChainer };
