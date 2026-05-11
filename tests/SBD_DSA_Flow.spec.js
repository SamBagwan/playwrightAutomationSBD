import { test, expect, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

//1. Locate the file 
const dataPath = path.join(process.cwd(), 'test-data.json');
// 2. Read and Parse
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const dynamicAppId = testData.appFormId;
//const dynamicAppId = "6ed637f2-bcfa-441c-aafc-df474a26e5af";
console.log("AppFormId:", dynamicAppId);
const userDataDir = path.join(process.cwd(), 'chrome-profile');

test.describe.serial('DSA Application Lifecycle', () => {
  let browserContext;
  let page;

  test.beforeAll(async () => {
    browserContext = await chromium.launchPersistentContext(userDataDir, {
      channel: "chrome",
      headless: true,
    });
    page = await browserContext.newPage();
    console.log("✅ Browser context launched successfully");
  });

  test('01 login to the DSA Portal', async () => {
    await page.goto('https://portal.uat.creditsaison.xyz/signin', { waituntill: 'networkidle' });
    console.log("Step: Navigated to Sign-in page");

    await page.locator('span:has-text("EXTERNAL LOGIN")').click();
    console.log("Step: Clicked External Login");

    // Check if "Welcome back" screen appears with passkey login
    const welcomeBackText = page.locator('text=Welcome back');
    const signInAsAnotherUserBtn = page.locator('text=Sign in as another user');
    
    if (await welcomeBackText.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log("Step: 'Welcome back' screen detected");
      await signInAsAnotherUserBtn.click();
      console.log("Step: Clicked 'Sign in as another user'");
      await page.waitForLoadState('networkidle');
    }

    await page.getByRole('textbox', { name: 'Registered Email ID' }).fill('releaseautomation2025@gmail.com');
    await page.locator('button:has-text("SEND OTP")').click();
    console.log("Step: Email entered and OTP sent");

    await page.locator("//input[@id='otp-box-0']").fill('8');
    await page.locator("//input[@id='otp-box-1']").fill('7');
    await page.locator("//input[@id='otp-box-2']").fill('6');
    await page.locator("//input[@id='otp-box-3']").fill('3');
    await page.locator("//input[@id='otp-box-4']").fill('2');
    await page.locator("//input[@id='otp-box-5']").fill('1');
    console.log("Step: OTP digits entered");

    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await page.waitForLoadState('networkidle');
    console.log("✅ Login successful");
  });

  test('02 Search appFormId and Start the flow', async () => {
    await page.locator("//div[@class='ant-space-item']//div[@class='ant-space-compact css-1m62vyb']//div[@class='ant-select-selector']").click();
    await page.locator("div[title='KSF App Form Id'] div[class='ant-select-item-option-content']").click();
    console.log("Step: Selected KSF App Form Id from dropdown");
    await await page.locator(".ant-input-compact-item >> input").fill(dynamicAppId);
    console.log(`Step: Entered AppFormId: ${dynamicAppId}`);
    await page.waitForTimeout(2000);
    await page.locator("//span[normalize-space()='Search']").click();
    await page.waitForLoadState('networkidle');
    console.log("Step: Search button clicked and results loaded");
    page.waitForTimeout(4000);
    const searchList = await page.getByText(dynamicAppId, { exact: true });
    expect(searchList).toBeVisible();
    await searchList.click();
    await page.waitForLoadState('networkidle');
    console.log("✅ Application selected from search list");
  });

  test('03 Data review stage - Business Details', async () => {
    await page.locator('li.MuiListItem-root.css-dt78af').first().click();
    const businessDetails = page.locator('div.MuiDialogContent-root');
    await expect(businessDetails).toBeVisible({ timeout: 10000 });
    console.log("Step: Business Details modal opened");
    await businessDetails.getByRole('textbox', { name: /Email/i }).fill('sameer.bagwan@creditsaison-in.com');
    await businessDetails.getByRole('textbox', { name: /Phone Number/i }).fill('9898989898');
    console.log("Step: Business Email and Phone filled");
    await businessDetails.getByRole('button', { name: /Business type/i }).click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    console.log("Step: Business Type selected");
    const firstRadio = businessDetails.getByRole('radio').first();
    await firstRadio.scrollIntoViewIfNeeded();
    await expect(firstRadio).toBeVisible();
    await firstRadio.click();
    console.log("Step: Ownership radio button selected");
    await businessDetails.locator('button:has-text("SAVE")').click();
    await expect(businessDetails).toBeHidden({ timeout: 10000 });
    console.log("✅ Business Details saved successfully");
  });

  test('04 Data review stage - Primary applicant details', async () => {
    await page.locator('li.MuiListItem-root.MuiListItem-gutters.MuiListItem-padding.css-dt78af').last().click();
    const primaryDetails = page.locator('div.MuiDialogContent-root.css-1azdixl');
    
    // 1. Locate the Aadhaar input field
    const aadhaarInput = primaryDetails.locator('#aadhaarNo');
    const aadhaarValue = await aadhaarInput.inputValue();

    if (aadhaarValue.trim() === "") {
        console.log("Status: Aadhaar field is empty. Starting Aadhaar verification flow.");
        await aadhaarInput.fill('6789');
        console.log("Step: Aadhaar last four digits entered as 6789 ");
        await primaryDetails.locator('button:has-text("VERIFY")').first().click();
        await page.waitForLoadState('networkidle');
        console.log("Step: PAN details verfied ");
        await primaryDetails.locator('button:has-text("VERIFY")').last().click();
        await page.waitForLoadState('networkidle');
        console.log("Step: Email verfied ");
    
    } else {
        console.log("Status: Aadhaar field is already populated. Skipping Aadhaar verification.");
        await primaryDetails.getByRole('button', { name: 'Verify' }).click();
        await page.waitForTimeout(2000); 
    }
    await primaryDetails.locator("#fatherFirstName").fill('sameer');
    await primaryDetails.locator("#fatherLastName").fill('Bagwan');
    console.log("Step: Father's details entered");
    const radioBtn = primaryDetails.getByRole('radio').first();
    await radioBtn.scrollIntoViewIfNeeded();
    await expect(radioBtn).toBeVisible();
    await radioBtn.click();
    console.log("Step: Residence status radio button clicked");
    await primaryDetails.locator('button:has-text("SAVE")').click();
    await expect(primaryDetails).toBeHidden();
    console.log("Step: Primary details saved");
    await page.getByRole('button', { name: 'Save and Next' }).click();
    console.log("✅ Primary Applicant stage completed");
  });

  test('05 Bank details', async () => {
    const bankCta = page.getByRole('button', { name: 'Save and Next' });
    await bankCta.scrollIntoViewIfNeeded();
    expect(bankCta).toBeVisible();
    await bankCta.click();
    console.log("✅ Bank details stage submitted");
  });

  test('06 , Offer Stage ', async () => {
    const offerHeader = page.getByText('Loan Offer Details');
    await expect(offerHeader).toBeVisible({ timeout: 120000 });
    console.log("Step: Offer screen appeared");
    const nextCta = await page.locator('button:has-text("NEXT")');
    await nextCta.scrollIntoViewIfNeeded();
    await nextCta.click();
    console.log("✅ Offer accepted");
  });

  test('07 Document Section', async () => {
    const submitCta = await page.getByRole('button', { name: 'Submit' });
    await expect(submitCta).toBeVisible();
    await submitCta.scrollIntoViewIfNeeded();
    await submitCta.click();
    await page.waitForLoadState('networkidle');
    console.log("✅ Application submitted successfully at Document Section");

    // Wait for next page to appear and network to be stable
    const finalStage = await page.getByText('Loan Offer Details', { exact: true })
    await expect(finalStage).toBeVisible({ timeout: 120000 });
    await page.waitForLoadState('networkidle');
    console.log("✅ Offer stage last stage reached successfully");
  });
  test.afterAll(async () => {
    // Keep browser open if needed for manual check, else close:
    await browserContext.close();
  });


});