import test from "ava";
import config from "config";
import {
  getAddressBalance,
  getBlockfrostApi,
  getTokenBalance,
  getUtxos,
} from "index";

test("getAddressBalance retrieves empty balance", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const balance = await getAddressBalance(
    blockfrost,
    "addr_test1qz80r0529pl59an0g94pdxkuwrerlpdv5hnq9rv8p4u68850zf66yynv4a7cq7rlhch9e9d3w99th26vak2p0susykxslvzl3y"
  );
  t.deepEqual(balance, {});
});

test("getAddressBalance retrieves correct balance", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const balance = await getAddressBalance(
    blockfrost,
    "addr_test1qzx383xhgu5u0jujfu4twz6l0tvcevceaj8t27r2mvxpf4dqvgguf9c0tu6h44yz39gkxhqjvmh7usdjdcukmapa0z7sgmyhmh"
  );
  t.deepEqual(balance, {
    "85d69af1ed6a4ac73210695c84a07ac074462690d064fd1b49c58bf465717561746f7269616c6d6f6e6f746f6e65":
      44211934251n,
    de25345d4bb5d57911babe775ece91c5bedfb58fe5446562d9fbbde174756d626c696e67636172726f74:
      784611607n,
    lovelace: 1452470n,
  });
});

test("getAddressBalance retrieves correct balance with many UTXOs", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const balance = await getAddressBalance(
    blockfrost,
    "addr_test1qz4p94zahrwxxjnsrm2sakxctk5jn09hm6cjyn032w2zu345mws57gauvjuptlla8v3vaqfumnhqcqc4g9nxj0lyxx2qugkqhc"
  );
  t.deepEqual(balance, {
    lovelace: 901172320n,
    "110f407d12e7fa228920a431146a3b2160cbd53e088e819abb13a91c6d796e74682d726964657273":
      1n,
  });
});

test("getTokenBalance retrieves correct balance", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const balance = await getTokenBalance(
    blockfrost,
    "b8794febdb27730a6f0476efe6736fb04fb24cd4f9bf02db150701df4d796e746820546f6b656e",
    "stake_test1uzsysekclaxgy8w5zwr9d70hpwczu02xax2uxt4xvp6kvdc7gvlrg"
  );
  t.is(balance, 42749501979n);
});

test("getTokenBalance retrieves 0 balance if token doesn't exist", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const balance = await getTokenBalance(
    blockfrost,
    "b8794febdb27730a6f0476efe6736fb04fb24cd4f9bf02db150701df4d796e746820556f6b656e",
    "stake_test1uzsysekclaxgy8w5zwr9d70hpwczu02xax2uxt4xvp6kvdc7gvlrg"
  );
  t.is(balance, 0n);
});

test("getUtxos retrieves empty UTXOs", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const utxos = await getUtxos(
    blockfrost,
    "addr_test1qzj2jztywlylay94vjfn06dvtgdz03360s08j8lnu55uvyyngg38emq0sqlvfsgyvhxlsy8pdzdemle3l604q2y7w6gs3vtnz0"
  );
  t.deepEqual(utxos, []);
});

test("getUtxos retrieves UTXOs", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const utxos = await getUtxos(
    blockfrost,
    "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t"
  );
  t.deepEqual(utxos, [
    {
      address:
        "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t",
      assets: {
        d420f271c14eed5a979db0382e7f113d7b1d313a06f3e224093e88c26469706c6f6d61746963656d696e656e6365:
          5n,
        lovelace: 1198180n,
      },
      outputIndex: 0,
      txHash:
        "42e2203a4934820a92168afa0f8315d1c0b3d4f87241edfc9a49a41d0dd53eee",
    },
    {
      address:
        "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t",
      assets: {
        "9686e3c896e37a9da29b2f90a4401f6bf8c2b57c4f2f20bf271c9f53727564647963687572636879617264":
          75815536432n,
        lovelace: 1219730n,
      },
      outputIndex: 1,
      txHash:
        "42e2203a4934820a92168afa0f8315d1c0b3d4f87241edfc9a49a41d0dd53eee",
    },
    {
      address:
        "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t",
      assets: {
        "9686e3c896e37a9da29b2f90a4401f6bf8c2b57c4f2f20bf271c9f53727564647963687572636879617264":
          36054391n,
        lovelace: 1202490n,
      },
      outputIndex: 2,
      txHash:
        "42e2203a4934820a92168afa0f8315d1c0b3d4f87241edfc9a49a41d0dd53eee",
    },
    {
      address:
        "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t",
      assets: {
        "02fe6518f9e0ad90f2c061986d79a2c15bd7eee1b27486882d3c95347461626f6f7377656570":
          848502242n,
        lovelace: 1180940n,
      },
      outputIndex: 3,
      txHash:
        "42e2203a4934820a92168afa0f8315d1c0b3d4f87241edfc9a49a41d0dd53eee",
    },
    {
      address:
        "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t",
      assets: {
        de25345d4bb5d57911babe775ece91c5bedfb58fe5446562d9fbbde174756d626c696e67636172726f74:
          754152011n,
        lovelace: 1198180n,
      },
      outputIndex: 4,
      txHash:
        "42e2203a4934820a92168afa0f8315d1c0b3d4f87241edfc9a49a41d0dd53eee",
    },
    {
      address:
        "addr_test1qqejuqmg55p7dmk6cdjvncz496qyw4mef84j6c7yytvvch7xclggrhv8f49p2tl6zmm0tey53dv32t79vypxwy8c3f6s50ae4t",
      assets: {
        lovelace: 297798075n,
      },
      outputIndex: 5,
      txHash:
        "42e2203a4934820a92168afa0f8315d1c0b3d4f87241edfc9a49a41d0dd53eee",
    },
  ]);
});

test("getUtxos retrieves many UTXOs", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const utxos = await getUtxos(
    blockfrost,
    "addr_test1qz4p94zahrwxxjnsrm2sakxctk5jn09hm6cjyn032w2zu345mws57gauvjuptlla8v3vaqfumnhqcqc4g9nxj0lyxx2qugkqhc"
  );
  t.is(utxos.length, 451);
});
