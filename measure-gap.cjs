const { chromium } = require("playwright");
async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3456", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.getElementById("work")?.scrollIntoView({behavior:"instant",block:"start"}));
  await page.waitForTimeout(1000);

  // check featured order (sunidhi first task)
  const featured = page.locator("#work .scrollbar-hide [role='button'] h3");
  const order = [];
  for (let i = 0; i < Math.min(await featured.count(), 5); i++) order.push(await featured.nth(i).textContent());
  console.log("FEATURED ORDER:", order.join(" -> "));

  await page.locator('#work [role="button"]', { hasText: "Seedhe Maut" }).last().click({ force: true });
  await page.waitForTimeout(700);
  const modal = page.locator(".fixed.inset-0.z-\\[10002\\]");
  const headerBar = modal.locator("h3").locator("xpath=ancestor::div[contains(@class,'shrink-0')][1]");
  const firstImg = modal.locator("img").first();
  const mb = await modal.boundingBox();
  const hb = await headerBar.boundingBox();
  const ib = await firstImg.boundingBox();
  console.log("viewport:", JSON.stringify(page.viewportSize()));
  console.log("modal:", JSON.stringify(mb));
  console.log("headerBar:", JSON.stringify(hb));
  console.log("firstImg:", JSON.stringify(ib));
  console.log("TOP GAP (viewport->header):", (hb.y - mb.y).toFixed(1));
  console.log("HEADER->PHOTO GAP:", (ib.y - (hb.y + hb.height)).toFixed(1));
  await browser.close();
}
main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
