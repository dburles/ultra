import {
  assertEquals,
  fail,
} from "https://deno.land/std@0.135.0/testing/asserts.ts";
import { Page } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { launchLocalhostBrowser, startTestServer } from "./helpers.ts";

const expectations = [
  { text: "Ultra", selector: "h1" },
  { text: "un-bundle the web", selector: "h2" },
  { text: "This is a lazily loaded component", selector: "h3" },
];

async function assertExpectedPageElements(page: Page) {
  for (const expected of expectations) {
    const selection = await page.waitForSelector(expected.selector);
    if (selection) {
      const text = await page.evaluate(
        (element) => element.textContent,
        selection,
      );
      assertEquals(text, expected.text);
    } else {
      fail(`ERROR: Selector ${expected.selector} not found`);
    }
  }
}

Deno.test("puppeteer: native server", async (t) => {
  const server = await startTestServer();
  const browser = await launchLocalhostBrowser();

  await t.step(
    "Should render home page of workspace example app with expected text",
    async () => {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 979, height: 865 });
        await page.goto("http://localhost:8000/", {
          waitUntil: "networkidle0",
        });

        await assertExpectedPageElements(page);
      } catch (error) {
        throw error;
      }
    },
  );

  await browser.close();
  server?.close();
});

Deno.test("puppeteer: oak server", async (t) => {
  const server = await startTestServer("start:oak");
  const browser = await launchLocalhostBrowser();

  await t.step(
    "Should render home page of workspace example app with expected text",
    async () => {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 979, height: 865 });
        await page.goto("http://localhost:8000/", {
          waitUntil: "networkidle0",
        });

        await assertExpectedPageElements(page);
      } catch (error) {
        throw error;
      }
    },
  );

  await browser.close();
  server?.close();
});
