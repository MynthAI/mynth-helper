import test from "ava";
import { getDirname, getLucid, readFilePath } from "index";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { assert, stub } from "sinon";

const dirname = getDirname(import.meta.url);

const server = setupServer();
test.before(() => {
  server.listen();
});
test.after(() => {
  server.close();
});
test.afterEach(() => {
  server.resetHandlers();
});

const setupPreviewHandler = async () => {
  const params = await readFilePath(
    dirname,
    "mocks",
    "preview-parameters.json"
  );
  server.use(
    rest.get(
      `https://cardano-preview.blockfrost.io/api/v0/epochs/latest/parameters`,
      (_req, res, ctx) => {
        return res(ctx.json(JSON.parse(params)));
      }
    )
  );
};

test("getLucid returns preview", async (t) => {
  await setupPreviewHandler();
  await getLucid("previewfaa780855b8f0b12b00364ce4a1fca83");
  t.pass();
});

test("getLucid returns mainnet", async (t) => {
  await setupPreviewHandler();
  const warn = stub(console, "warn");

  try {
    await t.throwsAsync(async () => {
      await getLucid("mainnetd9ba61733c6d79c351203161b0ac082b");
    });
    assert.calledOnce(warn);
  } finally {
    warn.restore();
  }
});
