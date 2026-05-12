import { test, expect, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';


// 1. Locate the file 
const dataPath = path.join(process.cwd(), 'test-data.json');
// 2. Read and Parse
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const dynamicAppId = testData.appFormId;
//const dynamicAppId = 'f60cf919-0418-48f7-b379-bf594a1ecc2f';
console.log("AppFormId:", dynamicAppId);
const userDataDir = path.join(process.cwd(), '.chrome-test-profile');

test.describe.serial('Jarvis Application Lifecycle', () => {
  let browserContext;
  let page;
  test.beforeAll(async () => {
    browserContext = await chromium.launchPersistentContext(userDataDir, {
      channel: "chrome",
      headless: true,
      args: ['--profile-directory=Default']
    });
    browserContext.setDefaultNavigationTimeout(60000);
    page = await browserContext.newPage();
    console.log(">> SUCCESS: Browser launched with persistent context.");
  });

  test('01. Access Portal and Initial Allocation', async () => {
    await page.goto("https://jarvis.uat.creditsaison.corp/", { waitUntil: 'networkidle' });
    console.log(">> LOG: Navigated to Jarvis Portal.");
    
    // Maximize the window
    await page.evaluate(() => {
      window.moveTo(0, 0);
      window.resizeTo(window.screen.width, window.screen.height);
    });
    console.log(">> LOG: Window maximized.");
    
    // Handle Google Account Selection / Google SSO Login
    try {
      // Check if "Choose an account" page is displayed
      const accountSelectionHeading = page.locator("text=Choose an account");
      const isAccountSelectionVisible = await accountSelectionHeading.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isAccountSelectionVisible) {
        console.log(">> LOG: Google account selection page detected.");
        
        // Click on the Sameer Bagwan account (sameer.bagwan@creditsaison-in.com)
        const sameerAccount = page.locator("text=sameer.bagwan@creditsaison-in.com").first();
        const isAccountVisible = await sameerAccount.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isAccountVisible) {
          console.log(">> LOG: Clicking on sameer.bagwan@creditsaison-in.com account.");
          await sameerAccount.click();
          await page.waitForTimeout(2000);
        } 
      }
      // Handle Password Entry
      const passwordInput = page.locator("input[type='password']").first();
      const isPasswordVisible = await passwordInput.isVisible({ timeout: 5000 }).catch(() => false);
      if (isPasswordVisible) {
        console.log(">> LOG: Password input field detected. Entering password.");
        await passwordInput.fill("Json@123456");
        await page.waitForTimeout(1000);
        
        // Click Sign In / Next button after password
        const signInBtn = page.locator("button:has-text('Sign In'), button:has-text('sign in'), button:has-text('Next'), button:has-text('next')").first();
        const isSignInVisible = await signInBtn.isVisible({ timeout: 3000 }).catch(() => false);
        if (isSignInVisible) {
          console.log(">> LOG: Clicking Sign In button.");
          await signInBtn.click();
          await page.waitForTimeout(3000);
        }
      }
      await page.waitForLoadState('networkidle');
      console.log(">> LOG: Authentication handling completed.");
    } catch (error) {
      console.log(">> LOG: No authentication page detected. Proceeding with normal flow.");
    }
    
    // User Allocation Logic
    await page.locator(".el-icon-monitor").click();
    page.waitForTimeout(5000);
    await page.locator(".el-switch__core").click();
    await page.waitForTimeout(2000);
    await page.locator("input[placeholder='Search application by']").click();
    await page.locator("li:nth-child(1) span:nth-child(1)").click();
    await page.locator("input[placeholder='Enter App ID']").fill(dynamicAppId);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(4) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > label:nth-child(1) > span:nth-child(1) > span:nth-child(1)").click();
    await page.locator("div[class='application-table'] button:nth-child(1) span:nth-child(1)").click();
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(3) > span:nth-child(1)").click();
    await page.locator("label:nth-child(2) span:nth-child(1) span:nth-child(1)").click();
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > label:nth-child(2) > span:nth-child(1) > span:nth-child(1)").click();
    await page.locator(".el-select__input.is-large").fill("sameer");
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await page.locator("div[class='el-dialog__wrapper'] button:nth-child(2) span:nth-child(1)").click();
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');
    console.log(">> SUCCESS: Initial Allocation completed for ID: " + dynamicAppId);
  });

  test ('02. Dashboard', async()=> {
    await page.locator(".el-icon-document-copy").click();
    await page.waitForTimeout(3000);
    page.locator("input[placeholder='Search by']").waitFor();
    await page.locator('i.el-input__icon.el-range__close-icon').click();
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Enter App ID' }).click();
    await page.getByRole('textbox', { name: 'Enter App ID' }).pressSequentially(dynamicAppId);
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000);
    const appId = page.getByText(dynamicAppId, { exact: true })
    await expect(appId).toBeVisible()
    await appId.click();
    console.log(">> SUCCESS: Application found and opened from Dashboard.");
  })

  test('03. Navigate to Application and Move to CAM Stage', async () => {
    await page.reload({waitUntil: 'networkidle'});
    await page.waitForTimeout(3000);
    const movetoCAM = page.locator('[placeholder="Application Actions"]');
    await expect(movetoCAM).toBeVisible({ timeout: 15000 });
    await movetoCAM.click()
    await page.getByText('Move to CAM').click()
    await page.getByRole('button', { name: 'Accept' }).click();
    await page.reload({ waitUntil: 'networkidle' });
    console.log(">> SUCCESS: Application moved to CAM Stage.");
  });

  test('04. Update Business', async () => {
    await page.locator("div[id='Business Details'] div button[type='button']").click();
    await page.locator("button[class='el-button el-button--default el-button--small']").waitFor();
    await page.locator("button[class='el-button el-button--default el-button--small']").click();
    const windownPopUpBusinessDetails = page.locator(".el-dialog__body");
    await windownPopUpBusinessDetails.locator("input[placeholder='Enter UAN/UDYAM Number']").fill("UDYAM-DL-03-0053383");
    await windownPopUpBusinessDetails.locator(".el-input-group__append").click();
    const udyamConfirmationModal = page.locator('div[role="dialog"]', { hasText: 'Are you sure you want to change the primary Udyam' });
    await expect(udyamConfirmationModal).toBeVisible();
    await udyamConfirmationModal.getByRole('button', { name: 'OK' }).click();
    await expect(udyamConfirmationModal).toBeHidden();
    await page.waitForTimeout(5000);
    await page.getByPlaceholder('Select the CGTMSE/Mudra').click();
    await page.getByText('Mudra', { exact: true }).click();
    await windownPopUpBusinessDetails.locator("//div[@class='cs-fab']").click();
    page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(5000);
    console.log(">> SUCCESS: Business and Udyam details updated.");
  });

  test ('05.Update co applicant details', async() => {
    await page.reload({waitUntil: 'networkidle'});
    await page.locator("a[class='tab-item nuxt-link-active'] p[class='tab-item-title']").click();
    await page.waitForLoadState('networkidle');
    const coApplicantTab = page.locator("div[id='Co-Applicant Details'] div button[type='button'] span span[class='appform-card-title']");
    await coApplicantTab.click();
    await page.waitForLoadState('networkidle'); 
    const coApplicantDetailsSection = page.locator("div[id='Co-Applicant Details']");
    const editButton = coApplicantDetailsSection.getByRole('button', { name: 'Edit', exact: true });
    await editButton.click(); 
    const viewButton = page.locator("button.view-btn.el-button--primary");
    await expect(viewButton).toBeVisible(); 
    await viewButton.click();
    const edit = page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(2) > span:nth-child(1)");
    await edit.click();
    page.waitForTimeout(1000)
    page.locator("//input[@placeholder='Select the Salutation']").click()
    await page.getByText('Mr.', { exact: true }).click();
    await page.locator("form[class='el-form'] div[class='cs-fab']").click();
    await page.waitForLoadState('networkidle');
    page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.locator('button:has-text("Consent Received Offline?")').click()
    const confirmBtn = page.locator('button').filter({ hasText: 'Confirm' }).last();
    await expect(confirmBtn).toBeVisible(); 
    await confirmBtn.click();
    await page.waitForTimeout(5000)
    await page.locator('i.el-icon-close:visible').click()
    await page.keyboard.press('Escape');
    console.log(">> SUCCESS: Co-applicant details and Consent updated.");
  });

  test('06. Update Bank Details', async () => {
    const bankSlection = page.locator('span').filter({ hasText: 'Bank Details' }).first()
    await bankSlection.scrollIntoViewIfNeeded();
    await bankSlection.click();
    await page.waitForTimeout(2000)
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.waitForTimeout(2000)
    const accountInput = page.getByPlaceholder('Enter account number').first();
    await accountInput.click();
    await accountInput.clear();
    await page.waitForTimeout(2000);
    await  page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.getByRole('textbox', { name: 'Select a account type' }).first().click()
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter');
    await page.getByRole('textbox', { name: 'Select a account type' }).last().click();
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter');
    const bankCtaBtn = page.locator("//div[@class='submit-row el-row']//div[@class='el-col el-col-24 el-col-md-6']//span[@aria-label='Arrow Right icon']//*[name()='svg']");
    await expect(bankCtaBtn).toBeEnabled();
    await bankCtaBtn.click();
    await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');
    await page.reload({waitUntil: 'networkidle'});
    console.log(">> SUCCESS: Bank Details successfully updated.");
  });

  test('07 appFormId allocation', async()=> {
    await page.locator(".el-icon-monitor").click();
    page.waitForTimeout(5000);
    await page.locator(".el-switch__core").click();
    await page.waitForTimeout(2000);
    await page.locator("input[placeholder='Search application by']").click();
    await page.locator("li:nth-child(1) span:nth-child(1)").click();
    await page.locator("input[placeholder='Enter App ID']").fill(dynamicAppId);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(4) > div:nth-child(3) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > label:nth-child(1) > span:nth-child(1) > span:nth-child(1)").click();
    await page.locator("div[class='application-table'] button:nth-child(1) span:nth-child(1)").click();
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(3) > span:nth-child(1)").click();
    await page.locator("label:nth-child(2) span:nth-child(1) span:nth-child(1)").click();
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > label:nth-child(2) > span:nth-child(1) > span:nth-child(1)").click();
    await page.locator(".el-select__input.is-large").fill("sameer");
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await page.locator("div[class='el-dialog__wrapper'] button:nth-child(2) span:nth-child(1)").click();
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    await page.reload({ waitUntil: 'networkidle' });
    console.log(">> SUCCESS: Second allocation step completed.");
  });

  test('08. appFormId dashboard and move to credit review stage', async () => {

    await page.locator(".el-icon-document-copy").click();
    await page.locator('i.el-input__icon.el-range__close-icon').click();
    await page.waitForTimeout(2000);
    const clkSearch =  page.getByRole('textbox', { name: 'Enter App ID' });
    await expect(clkSearch).toBeVisible()
    await clkSearch.click();
    await clkSearch.pressSequentially(dynamicAppId);
    page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    page.waitForTimeout(2000);
    const appIDLocator = page.getByText(dynamicAppId);
    await appIDLocator.click();
    await page.waitForTimeout(3000);
    await page.locator("input[placeholder='Application Actions']").click();
    page.locator("div[class='el-select-dropdown el-popper'] li:nth-child(1)").click();
    await page.locator("button[class='el-button accept-btn el-button--default'] span").click();
    await page.waitForTimeout(10000);
    

  });
  test('09. UAN Verification', async () => {
    
    
    const verificationTab = page.getByText('Verification').last();
    await expect(verificationTab).toBeVisible({ timeout: 10000 });
    await verificationTab.click();
    await page.getByRole('button', { name: /edit/i }).click();
    await page.waitForTimeout(2000);
    await page.locator('span').filter({ hasText: 'Resolve' }).last().click();
    const container = page.locator("div[aria-label='Resolve Kyc'] .el-dialog__footer");
    await container.waitFor({ state: 'visible' });
    await container.getByRole('button', { name: 'Resolve', exact: true }).click();
    await page.waitForTimeout(5000);
    console.log(">> SUCCESS: Moved to Credit Review and UAN verified.");
  });

  test('10. Move to Credit Approval stage', async () => {
    await page.reload({waitUntil: 'networkidle'});
    await page.getByRole('textbox', { name: 'Application Actions' }).click();
    await page.locator('li').filter({ hasText: 'Move to Credit Approval' }).click();
    const confirmCTABtn = page.locator('button.el-button.el-button--default.el-button--small.el-button--primary');
    await confirmCTABtn.waitFor({state: "visible"})
    await confirmCTABtn.click();
    await page.locator("//input[@placeholder='All Level']").click()
    await page.locator('li:has-text("L4")').click();
    await page.locator("//input[@placeholder='User email id']").click();
    await page.locator('li').filter({ hasText: 'sameer.bagwan@creditsaison-in.com' }).click();
    await page.getByText('Accept').last().click();
    await page.waitForTimeout(5000);
    await page.reload({ waitUntil: 'networkidle' });
    console.log(">> SUCCESS: Application assigned to Credit Approval (L4).");
  });


  test('11. Move to terms', async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('textbox', { name: 'Application Actions' }).click();
    await page.locator('li:has-text("Move to Terms")').click();
    await page.locator('span').filter({ hasText: 'Accept' }).click();
    await page.waitForLoadState('networkidle');
    await page.reload({ waitUntil: 'networkidle' });
    console.log(">> SUCCESS: Application moved to Terms stage.");
  });

  test('12 loan requirment and deferral booking at terms stage', async()=>{
    await page.locator('p').filter({ hasText: 'App Form' }).first().click();
    await page.locator('span').filter({ hasText: 'Loan Requirements & Terms' }).last().click();
    await page.locator("button[class='el-button edit-btn el-button--primary'] span").click();
    await page.waitForTimeout(3000);
    const ROI =  page.getByRole('textbox', { name: 'Enter the interest rate' })
    await ROI.click()
    await ROI.clear()
    await ROI.fill('27')
    await page.locator("//input[@placeholder='Enter the processing fee percentage']").fill('3.5');
    await page.locator("//div[@class='cs-fab']").click();
    await page.waitForTimeout(3000);
    await page.keyboard.press('Escape');
    await page.reload({waitUntil: 'networkidle'});
    await page.waitForTimeout(5000);
    const defferalCTA = page.locator("div[id='Deferral Document'] div button[type='button'] span span[class='appform-card-title']")
    await defferalCTA.scrollIntoViewIfNeeded();
    await defferalCTA.click();
    await page.locator('span:has-text("Add Deferral Document")').click();
    await page.locator("//body/div[@id='__nuxt']/div[@id='__layout']/div/section[@class='el-container app-container']/section[@class='el-container content-wrapper']/main[@class='el-main dashboard-main-slot']/div[@class='application-layout ubl-layout']/div[@class='application-page-component']/div[@class='fixedMainbar application-main-slot-with-side-bar application-main-slot-default']/div[@id='mainView']/div/div/div[@class='appform-section-container']/div[@id='Deferral Document']/div/div[@class='el-dialog__wrapper']/div[@aria-label='dialog']/div[@class='el-dialog__body']/div/form[@class='el-form form-deferral-docs']/div[@class='form']/div[1]/div[1]/div[1]/div[1]/div[1]").click();
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await page.locator("//div[@class='el-row']//div[2]//div[1]//div[1]//div[1]//div[1]//input[1]").click();
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > section:nth-child(1) > section:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > form:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)").click();
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await page.locator("//input[@placeholder='Pick the Receipt Date']").click();
    await page.locator('span').filter({ hasText: '30' }).last().click();
    await page.getByText('Confirm', { exact: true }).last().click();
    await page.waitForTimeout(4000);
    await page.keyboard.press('Escape');
    console.log(">> SUCCESS: Loan requirements and Deferral booking completed.");
  })

  test('13 Move to fulfilment', async () => {
    await page.reload({waitUntil: 'networkidle'})
    await page.getByRole('textbox', { name: 'Application Actions' }).click();
    await page.locator('li:has-text("Move to Fulfilment")').click();
    await page.locator('button.el-button.accept-btn.el-button--default:visible').click();
    await page.waitForTimeout(7000);
    await page.reload({waitUntil: 'networkidle'});
    console.log(">> SUCCESS: Application moved to Fulfilment stage. Workflow Complete.");
  });

  test.afterAll(async () => {
    // Keep browser open if needed for manual check, else close:
    await browserContext.close();
  });
});