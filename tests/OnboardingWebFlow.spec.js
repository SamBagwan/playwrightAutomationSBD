import { test, expect, chromium } from '@playwright/test';
import * as path from 'path';

const appFormId ='9576f6b3-a422-4674-b02f-e5ddf2d2ec92';

test ('onboarding flow', async() => {

     const userDataDir =
    "C:\\Users\\Home\\AppData\\Local\\Google\\Chrome\\User Data";
 const browserContext = await chromium.launchPersistentContext(userDataDir, {
        channel: "chrome",
    });
    // FIX: Use 'browserContext' instead of 'browser'
    const page = await browserContext.newPage();
   await page.goto("https://loans.int.creditsaison.in/", {
       waitUntil: 'networkidle'
  });

  await page.locator("input[placeholder='Mobile number']").fill("9330674240");
  await page.locator(".v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light").click();
  await page.locator("button[type='submit']").click();
  page.locator('#input-114--0' , {waitUntil : 'networkidle'});
  await page.locator('#input-32--0').fill('1');
  await page.locator('#input-32--1').fill('2');
  await page.locator('#input-32--2').fill('3');
  await page.locator('#input-32--3').fill('4');
  await page.locator('#input-32--4').fill('5');
  await page.locator('#input-32--5').fill('6');
  await page.locator("button[type='submit'] span[class='v-btn__content']").click();
  page.locator("button[type='button']").waitFor();
  await page.getByRole('button', {name: "Continue"}).click();

  //Verify address details
  //const fileInputElement = page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > main:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > div:nth-child(8) > div:nth-child(1) > div:nth-child(1) > img:nth-child(3)");
  //const FileInput = page.locator("//div[@class='pb-12 mb-12']//div[1]//div[1]//img[1]");
  // await fileInputElement.click();
  const hiddenFileInput = page.locator('input[type="file"]', {
    hasText: 'Correspondence Address Proof' 
}).first();
//await hiddenFileInput.click();
  const filePath = '/Users/sameerbagwan/PlayWriteAutomation/tests/File/upload.jpg';
  await hiddenFileInput.setInputFiles(filePath);
  await page.keyboard.press('Escape');
  await page.waitForLoadState('networkidle');
  page.waitForTimeout(2000);
  const checkbox = page.locator("//div[@class='v-input--selection-controls__ripple primary--text']");
  //await expect(checkbox).toBeVisible({ timeout: 10000 });
  await checkbox.click(); 
  await page.getByText('Continue Upload').click();
  await expect(page.getByText('upload.jpg')).toBeVisible();
  
  

});