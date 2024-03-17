import crypto from "crypto";
import test from "ava";
import config from "config";
import Decimal from "decimal.js";
import { getBlockfrostApi, getMntAmount, getPool } from "index";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer();

test.before(() => {
  server.listen();
});

test.after.always(() => {
  server.close();
});

test.afterEach.always(() => {
  server.resetHandlers();
});

test.serial("getPool returns correct price for MNT", async (t) => {
  const api = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const txHash = crypto.randomBytes(32).toString("hex");
  const mntId = crypto.randomBytes(32).toString("hex");
  const poolId = crypto.randomBytes(32).toString("hex");
  const lpTokenId = crypto.randomBytes(32).toString("hex");

  server.use(
    rest.get(
      `https://cardano-preview.blockfrost.io/api/v0/assets/${poolId}/transactions`,
      (_req, res, ctx) => {
        return res(ctx.json([{ tx_hash: txHash }]));
      }
    )
  );
  server.use(
    rest.get(
      `https://cardano-preview.blockfrost.io/api/v0/txs/${txHash}/utxos`,
      (_req, res, ctx) => {
        return res(
          ctx.json({
            outputs: [
              {
                amount: [
                  { unit: "lovelace", quantity: "4337041832" },
                  { unit: mntId, quantity: "11003429079" },
                  { unit: poolId, quantity: "1" },
                ],
              },
            ],
          })
        );
      }
    )
  );
  server.use(
    rest.get(
      `https://cardano-preview.blockfrost.io/api/v0/assets/${lpTokenId}`,
      (_req, res, ctx) => {
        return res(ctx.json({ quantity: "4137496724" }));
      }
    )
  );

  const pool = await getPool(api, poolId, mntId, lpTokenId);
  t.is(pool.lovelace, "4337041832");
  t.is(pool.token, "11003429079");
  t.is(pool.lpTokens, "4137496724");
});

test.serial("getMntAmount returns correct amount", (t) => {
  const pool = {
    lovelace: "63237097733",
    lpTokens: "0",
    token: "217479146891",
  };
  const adaAmount = new Decimal("1000");
  const mntAmount = getMntAmount(pool, adaAmount, 6);

  t.deepEqual(mntAmount, new Decimal("3439.107022"));
});

test.serial("getMntAmount returns correct amount 2", (t) => {
  const pool = {
    lovelace: "64102552431",
    lpTokens: "0",
    token: "214515938754",
  };
  const adaAmount = new Decimal("1537.543666");
  const mntAmount = getMntAmount(pool, adaAmount, 6);

  t.deepEqual(mntAmount, new Decimal("5145.311854"));
});
