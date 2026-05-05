import { test, expect, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 1. Locate the file 
const dataPath = path.join(process.cwd(), 'test-data.json');
// 2. Read and Parse
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const dynamicAppId = testData.appFormId;
console.log("AppFormId:", dynamicAppId);
const userDataDir = path.join(process.cwd(), 'chrome-profile');

test.describe.serial('DSA Application Lifecycle', () => {
  let browserContext;
  let page;

  test.beforeAll(async () => {
    browserContext = await chromium.launchPersistentContext(userDataDir, {
      channel: "chrome",
      headless: false,
    });
    page = await browserContext.newPage();
    console.log("✅ Browser context launched successfully");
  });

  test('01 login to the DSA Portal', async () => {
    await page.goto('https://privo.uat.creditsaison.xyz/login', { waitUntil: 'networkidle' });
    
    await page.getByRole('textbox', { name: 'Mobile number' }).fill("8787909034");
    await page.locator('label.consent-label').click();
    await page.getByText('Send OTP', { exact: true }).click();
    
    // 2. Wait for the OTP section to appear
    const otpInputs = page.locator('form input');
    await otpInputs.first().waitFor(); 

    // 2. Loop through the inputs to fill the OTP
    const otpCode = "123456";
    for (let i = 0; i < otpCode.length; i++) {
        // nth(i) targets the exact input box (0 to 5)
        await otpInputs.nth(i).fill(otpCode[i]);
    }
    await page.locator('span:has-text("Verify")').click();
    await page.waitForLoadState('networkidle');
    console.log("✅ Login successful");
})

    test('02  Start the flow', async () => {

        const completecCtaBtn = await page.getByText('Complete Your Application', { exact: true });
        await completecCtaBtn.waitFor({ state: 'visible', timeout: 60000 });
        await completecCtaBtn.click();
        console.log("✅ Clicked on Complete Your Application button");

        await page.waitForTimeout(5000);
        const offerCta = await page.locator('span:has-text("Continue")');
        await offerCta.scrollIntoViewIfNeeded();
        await expect(offerCta).toBeVisible({ timeout: 60000 });
        await offerCta.click();
        console.log("✅ Clicked on Continue button to view offers");
    })

})
