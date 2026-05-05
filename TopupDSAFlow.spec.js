import { test, expect, chromium } from '@playwright/test'; // Added expect for best practice

const appFormId ='d744e55e-3030-42a6-814d-8640f39b1648';

test('Open the DSA portal', async () => {
 const userDataDir =
    "C:\\Users\\Home\\AppData\\Local\\Google\\Chrome\\User Data";
 const browserContext = await chromium.launchPersistentContext(userDataDir, {
        channel: "chrome",
    });
    // FIX: Use 'browserContext' instead of 'browser'
    const page = await browserContext.newPage();
   await page.goto("https://portal.dev.creditsaison.xyz/signin", {
       waitUntil: 'networkidle'
  });
  console.log(await page.title()) ;
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedSecondary.MuiButton-sizeLarge.MuiButton-outlinedSizeLarge.MuiButton-fullWidth.MuiButton-root.MuiButton-outlined.MuiButton-outlinedSecondary.MuiButton-sizeLarge.MuiButton-outlinedSizeLarge.MuiButton-fullWidth.css-1deq0dc').click();
  await page.locator("input[id=':r1:']").fill("anurag.vs@creditsaison-in.com");
  await page.locator("button[type='submit']").click();
  page.locator('#otp-box-0').waitFor();
  await page.locator('#otp-box-0').fill("8");
  await page.locator('#otp-box-1').fill("7");
  await page.locator('#otp-box-2').fill("6");
  await page.locator('#otp-box-3').fill("3");
  await page.locator('#otp-box-4').fill("2");
  await page.locator('#otp-box-5').fill("1");
  await page.locator("button[type='submit']").click();
  //await page.locator('button:nth-child(1) span:nth-child(1)').click();
  page.locator("div[class='ant-space-item'] div[class='ant-space-compact css-1m62vyb'] div[class='ant-select-selector']").waitFor();
  await page.locator("div[class='ant-space-item'] div[class='ant-space-compact css-1m62vyb'] div[class='ant-select-selector']").click();
  await page.getByText('KSF App Form Id').click();
  await page.locator("input[placeholder='Enter your search']").click();
  await page.locator("input[placeholder='Enter your search']").fill(appFormId);
  await page.locator("button[type='button'] span:nth-child(2)").click();
  await page.waitForTimeout(3000);
  await page.locator('td:nth-child(1)').click();
  page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > div:nth-child(1)").waitFor();
  
  //Additional Details Stage
  await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(2) > span:nth-child(1)").click();
  page.locator("body > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > div:nth-child(1)").waitFor();
  page.locator(".MuiDialogContent-root.css-1azdixl").waitFor();
  const popup = page.locator(".MuiDialogContent-root.css-1azdixl");
  const confirmButton = popup.getByRole('button', { name: 'SAVE' });
  await page.waitForTimeout(2000);
  await confirmButton.click();
  //await page.waitForTimeout(5000);

  // Additional Details 
   await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(2) > span:nth-child(1)").click(); 
   page.locator(".MuiDialogContent-root.css-1azdixl").waitFor();
   const windownPopup = page.locator(".MuiDialogContent-root.css-1azdixl");
   const revalidate = windownPopup.locator("div[class='MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-standard MuiInputAdornment-sizeSmall css-1nvf7g0'] button[type='button']");
   await revalidate.click();
   page.waitForTimeout(5000);
   await windownPopup.getByRole('button', { name: 'SAVE' }).click();
   await page.waitForTimeout(5000);
   await page.getByRole('button', {name: 'Save and Next'}).click();
   await page.locator(".MuiTypography-root.MuiTypography-h5.css-1rz0m2l").waitFor();

  //  Bank Details
  //await page.locator("button[id=':r22:']").click();
   await page.getByRole('button', {name: "Save and Next"}).click();
   
  //Offer Details 
  await page.locator("div[class='MuiListItemText-root css-1tsvksn'] span[class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig']").waitFor();
  await page.getByRole('button', {name: "Next"}).click();
  //Document section
  await page.locator("button[id=':r6h:']").waitFor();
  await page.getByRole('button', {name: "Submit"}).click();
  //Offer page
  await page.locator("div[class='MuiListItemText-root css-1tsvksn'] span[class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig']").waitFor();

});