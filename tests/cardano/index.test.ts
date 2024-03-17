import test from "ava";
import config from "config";
import {
  getAddressFromSeed,
  getBlockfrostApi,
  getPrivateKeyFromSeed,
  getStakeKey,
  resolveAdaHandle,
} from "index";
import { generateSeedPhrase, Lucid } from "lucid-cardano";
import { FakeProvider } from "./FakeProvider";

test("resolveAdaHandle resolves correctly", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const address = await resolveAdaHandle(
    blockfrost,
    "85c036f660d8f6d192ad2928b5b6157441cc561d563e7eb0e19d4414",
    "niylkhvqhf"
  );
  t.is(
    address,
    "addr_test1qpp5c8ccp594aj6j73ad7duym38hng8cvrq5qgf96u5ga2zhvyzhvvh3jg9pl6mqxwyr7n5cm50yn5632dn2p5qdecss03g6e7"
  );
});

test("resolveAdaHandle resolves correctly 2", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.preview"));
  const address = await resolveAdaHandle(
    blockfrost,
    "6c95062890e345cce12e8e330c11af7264d5a308a56ca152f3b3f716",
    "amgswxtfiqnrt"
  );
  t.is(
    address,
    "addr_test1qq9jqrfvvw25pucvfgut6az95w9tlsl2kqz0k6tzwjx2ww89sy9umwyfk6a9qf8wxh79kcx2aq4cu794ja3gpw76twksvyywkj"
  );
});

test("resolveAdaHandle resolves correctly when handle name requires @ to resolve", async (t) => {
  const blockfrost = getBlockfrostApi(config.get<string>("blockfrost.mainnet"));
  const address = await resolveAdaHandle(
    blockfrost,
    "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a",
    "$mynth-riders"
  );
  t.is(
    address,
    "addr1qydcq7f4vt6p5v9qt742ggqh4hp9uqk2wsanf6xcanr6yj73u4y9vdd04smfxvdd40yvnhyyjwf3jvqz89np4gqkcp3q36rh34"
  );
});

test("getStakeKey gets correct key for mainnet", (t) => {
  t.is(
    getStakeKey(
      "addr1qx8zfate88tr3lg9jsja9hhyhxahw0nww5ey7tj50x4pm465x82xxcmdqe9p8m3x7x28xrywqc0d0mn8ww4evgx83wssgjkepp"
    ),
    "stake1u92rr4rrvdksvjsnacn0r9rnpj8qv8khaenh82ukyrrchgg0mey75"
  );
});

test("getStakeKey gets correct key for preview", (t) => {
  t.is(
    getStakeKey(
      "addr_test1qqzgpynsyp2tlku7vas6vv94p70vnpd8ehq34tmkcf2f393gqy0enxxeepjqpr7m8anjpwg9tjhfjr3nmzpp848nngyqpyf3yf"
    ),
    "stake_test1uq5qz8uenrvuseqq3ldn7eeqhyz4et5epcea3qsn6nee5zqaf7xmd"
  );
});

test("getStakeKey gets correct key for mainnet script", (t) => {
  t.is(
    getStakeKey(
      "addr1x869rrkuyg78fvj6gctf2205p83mewqv6lf0hrw3cfk2fvz5vaw8jada734q7034m5hqcc5p7xfl636pem6qtm885mdsc4hmf4"
    ),
    "stake1792xwhrewk7lg6s08c6a6tsvv2qlrylagaquaaq9ann6dkcxxz4hx"
  );
});

test("getStakeKey gets correct key for preview script", (t) => {
  t.is(
    getStakeKey(
      "addr_test1xr4xlzz30tmlr82azhtj3kuqx6xj7v9asu7zmccle6pnrcf80qzpf4unlkwjludvu42hpyfe4r0d80g9j93ay3eyhdrsuja5nm"
    ),
    "stake_test17qnhspq567flm8f07xkw24tsjyu63hknh5zezc7jgujtk3cvse7hy"
  );
});

test("getAddressFromSeed returns correct mainnet address", async (t) => {
  const seed = generateSeedPhrase();
  const lucid = await Lucid.new(new FakeProvider(), "Mainnet");
  lucid.selectWalletFromSeed(seed);

  const lucidAddress = await lucid.wallet.address();
  const address = getAddressFromSeed(seed);
  t.is(address, lucidAddress);
});

test("getAddressFromSeed returns preview address", async (t) => {
  const seed = generateSeedPhrase();
  const lucid = await Lucid.new(new FakeProvider(), "Preview");
  lucid.selectWalletFromSeed(seed);

  const lucidAddress = await lucid.wallet.address();
  const address = getAddressFromSeed(seed, "testnet");
  t.is(address, lucidAddress);
});

test("getPrivateKeyFromSeed returns correct privete key", (t) => {
  const key = getPrivateKeyFromSeed(
    "situate tide slow aim detect canvas welcome south senior device involve liar subway clinic hire enemy table program despair tomorrow soda various boost ordinary"
  );
  t.is(
    key,
    "ed25519e_sk1yqwahfur6kj62c9uv7jstwsn73cuv7z3vfy84rtld544w2dv5arafmkrk0rgrk8c3t6dtnav30ke3pdfne52uzq09756fymyckpyucg4gfcvf"
  );
});

test("getPrivateKeyFromSeed returns correct privete key 2", (t) => {
  const key = getPrivateKeyFromSeed(
    "budget spend blossom hobby bonus pepper person child oak flavor crumble tiny desk budget slender flip noodle sunny refuse student nice enact crazy grain"
  );
  t.is(
    key,
    "ed25519e_sk1jzh6r8c2vcqh3j78ag40kh9hrl6thg00fprd05gk29t8lsk2d9tyvpylqcp85lzkvhzjrr6hku7twkft6v8up7f3c4695fczpnx5y6g8jf08q"
  );
});
