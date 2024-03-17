import test from "ava";
import config from "config";
import { getBlockfrostApi, getPool } from "index";

test("getPool returns price for MNT mainnet", async (t) => {
  const api = getBlockfrostApi(config.get<string>("blockfrost.mainnet"));

  const lpTokenId =
    "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d8657da145be8f65e3c05a6f9c2da4306505f3cfe4c084cdba9c3a04de7ece1be84";
  const mntId =
    "43b07d4037f0d75ee10f9863097463fc02ff3c0b8b705ae61d9c75bf4d796e746820546f6b656e";
  const poolId =
    "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb157da145be8f65e3c05a6f9c2da4306505f3cfe4c084cdba9c3a04de7ece1be84";

  const pool = await getPool(api, poolId, mntId, lpTokenId);
  t.true(parseInt(pool.lovelace) > 0);
  t.true(parseInt(pool.token) > 0);
  t.true(parseInt(pool.lpTokens) > 0);
});

test("getPool returns price for MNT preprod", async (t) => {
  const api = getBlockfrostApi(config.get<string>("blockfrost.preprod"));

  const lpTokenId =
    "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d863ba9811cc90497d98bde0f84596e674b9ac8fb342eaae23fe096733775338162";
  const mntId =
    "b9ee35f237f85c7f93f6937073e4c69a3cd91d9e40a66104d1d5ac054d796e746820546f6b656e";
  const poolId =
    "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb13ba9811cc90497d98bde0f84596e674b9ac8fb342eaae23fe096733775338162";

  const pool = await getPool(api, poolId, mntId, lpTokenId);
  t.true(parseInt(pool.lovelace) > 0);
  t.true(parseInt(pool.token) > 0);
  t.true(parseInt(pool.lpTokens) > 0);
});
