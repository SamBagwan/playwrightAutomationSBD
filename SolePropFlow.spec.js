import { test, expect } from '@playwright/test';
import { generatePAN, generateName } from '../panGenerator';
import { mystiqueData, personalDetails, pdPoll, bizDetails, bizPoll, initiateBank, bankPoll, bankStatus, ioPoll, kyc, selfie, consent, additionalDetails } from '../requestBody';
import { writeFileSync } from 'fs';

// Helper function for polling with retry
async function pollWithRetry(request, url, headers, params, data, maxRetries = 24) {
    let status = "";
    let retries = 0;
    
    while (status !== "COMPLETE" && retries < maxRetries) {
        const res = await request.post(url, { headers, params, data });
        const json = await res.json();
        status = json.responseBody?.polling_status || "";
        
        if (status !== "COMPLETE") {
            console.log(`⏳ Polling attempt ${retries + 1}/${maxRetries}, status: ${status}`);
            await new Promise(r => setTimeout(r, 5000));
            retries++;
        }
    }
    
    if (status !== "COMPLETE") {
        throw new Error(`Polling timeout after ${maxRetries} attempts`);
    }
    return status;
}

// Helper function for API calls with error details
async function makeAPICall(request, method, url, config) {
    try {
        const res = method === 'GET' ? 
            await request.get(url, config) : 
            method === 'PUT' ? 
            await request.put(url, config) : 
            await request.post(url, config);
            
        if (!res.ok() && res.status() !== 200) {
            const errorBody = await res.text();
            throw new Error(`API Error ${res.status()}: ${errorBody}`);
        }
        return res;
    } catch (error) {
        console.error(`❌ API Call Failed: ${error.message}`);
        throw error;
    }
}

test.describe.serial('DSA Application Lifecycle - Sole Prop Full Flow', () => {
    let appFormId, pan, name, bizPan, bizName, reportId, htmlFile;
    const urls = { 
        morpheus: "https://morpheus.uat.creditsaison.corp", 
        privo: "https://privoapi.uat.creditsaison.xyz", 
        mystique: "https://mystique.uat.creditsaison.corp" 
    };
    const auth = "Basic QGRNMU46UEAkJFcwckQ="; 
    const token = "eyJraWQiOiJsZVRKWkplXC9jcWVQSWp1dXQ0ZkRlSnRZb0tEeXB3T3dJaDZsYlhSY2xXRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjODgzZjljMi0yMDBhLTRlZWMtYmI5NC1jZWU3OTllMjc3ZDMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ZYlpDb2JWMTciLCJjbGllbnRfaWQiOiIzdm1la2NzYWVmdHM1NTBzajlpZ2h1NTY0aCIsIm9yaWdpbl9qdGkiOiIxYjVjOTQ2MC1kNDdjLTQ0YzItOWMwZC1lMTAzZGVjNzM2OTEiLCJldmVudF9pZCI6ImZiZmE5YzhlLTgwMjItNDE2Zi1iOWMwLTAwZjg4MDRiZmQ5YyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NzIwODc5MjcsImV4cCI6MTc3MjEyMzkyNywiaWF0IjoxNzcyMDg3OTI3LCJqdGkiOiIyODI4N2NjYS02ODMyLTRmMDAtOGRkMi01NTQ1Y2MwYTdiMzYiLCJ1c2VybmFtZSI6ImM4ODNmOWMyLTIwMGEtNGVlYy1iYjk0LWNlZTc5OWUyNzdkMyJ9.oEsw27C4WkUd84QDc1e6_H3A3iK7MhCnZMTMBQm5aAfw2dwLaeOJ3nHyiy1ZOBUK7a2IifAg_Yl8ZyspqK8uJyDhvMOTU4fjzH9HkEPUBc9FcjNzwCyMFjxwTmnRX_0emH1eLErjnHJ9Tbu88wN-1BJHuFMfMgU5G4oc2cFjYvC7DMA9a781fthjE81-L8inbXe5GDTohfKzFSYBaciki9n-zQ_q9Y5nXJ6nmqihPcAYbSzDPZHTBX7BIpjFEv3q1MFXn-2Ylrfl98oM7GCRxs7oTT1bhNU3fxCuadZfiRRhQHHdtX38hn_oDKU5bpGZemw5aBZk95L7WPDciguG4w";

    test('00 deleteappFormId', async ({ request }) => {
        try {
            const res = await request.post(`${urls.privo}/test-automation/api/v1/appForm/clear`, {
                headers: { 'Authorization': auth, 'x-api-key': 'jfhjYkOE8a5xZLs9ZeGH676HPfGfajiNaU9wNmkR' },
                params: { phone_number: "9898334455" }
            });
            expect(res.ok()).toBeTruthy();
            console.log('✅ [TEST 00] Application form cleanup completed successfully');
        } catch (error) {
            console.error('⚠️ [TEST 00] Cleanup warning (non-critical):', error.message);
        }
    });

    test('01 prerequisiteData', async () => {
        pan = generatePAN(); 
        name = generateName();
        console.log(`📋 [TEST 01] Generated PAN: ${pan}, Name: ${name}`);
        console.log('✅ [TEST 01] Test data generation completed successfully');
    });

    test('02 mystique - KYC Verification', async ({ request }) => {
        const payload = mystiqueData(pan, name);
        console.log('📤 [TEST 02] Sending KYC payload:', JSON.stringify(payload, null, 2));

        const res = await request.post(`${urls.mystique}/addKyc`, {
            headers: { 
                'Authorization': auth, 
                'x-karza-key': 'hrntouwjt7K09TBQ09Bm',
                'Content-Type': 'application/json'
            },
            params: { kycType: 'pancard' }, 
            data: payload
        });
        
        if (res.status() !== 200) {
            const errorText = await res.text();
            console.error(`❌ [TEST 02] Mystique API Error ${res.status()}:`, errorText);
            throw new Error(`Mystique API failed: ${errorText}`);
        }
        
        const responseJson = await res.json();
        console.log('✅ [TEST 02] KYC verification successful. Response:', JSON.stringify(responseJson, null, 2));
    });

    test('03 personalDetails - Create AppForm', async ({ request }) => {
    const payload = personalDetails(name, pan);
    console.log('📤 [TEST 03] Sending personal details:', JSON.stringify(payload, null, 2));

    const res = await request.post(`${urls.morpheus}/api/v2/appForm`, {
        headers: { 
            'Authorization': auth, 
            'requestingSub': 'e133fd3a-20d1-706a-9723-0b8f14d09649',
            'Content-Type': 'application/json'
        },
        data: payload
    });
    
    // ✅ Add error logging BEFORE asserting
    if (!res.ok()) {
        const errorText = await res.text();
        console.error(`❌ [TEST 03] Morpheus API Error ${res.status()}:`, errorText);
        throw new Error(`Personal details API failed: ${res.status()} - ${errorText}`);
    }
    
    const json = await res.json();
    appFormId = json.appFormId;
    
    expect(appFormId).toBeDefined();
    writeFileSync('test-data.json', JSON.stringify({ appFormId }, null, 2));
    
    console.log(`✅ [TEST 03] Personal details submitted successfully. AppFormId: ${appFormId}`);
});
    test('04 personalDetailsPolling', async ({ request }) => {
        console.log('⏳ [TEST 04] Polling personal details processing...');
        
        await pollWithRetry(
            request,
            `${urls.privo}/api/v1/poll`,
            { 'Authorization': token },
            { app_form_id: appFormId, type: "personal_details" },
            pdPoll(appFormId)
        );
        
        console.log('✅ [TEST 04] Personal details processing completed successfully');
    });

    test('05 businessTestData', async () => {
        bizPan = generatePAN(); 
        bizName = "Sameer Enterprise";
        console.log(`📋 [TEST 05] Business test data - PAN: ${bizPan}, Name: ${bizName}`);
        console.log('✅ [TEST 05] Business test data generation completed successfully');
    });

    test('06 businessDetails - Submit Business Info', async ({ request }) => {
        const payload = bizDetails(bizName);
        console.log('📤 [TEST 06] Sending business details:', JSON.stringify(payload, null, 2));

        const res = await request.post(
            `${urls.morpheus}/api/v1/business/appForm/${appFormId}/businessDetails`, 
            {
                headers: { 
                    'Authorization': auth, 
                    'requestingSub': 'e133fd3a-20d1-706a-9723-0b8f14d09649',
                    'Content-Type': 'application/json'
                },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 06] Business details submitted successfully');
    });

    test('07 businessPolling', async ({ request }) => {
        console.log('⏳ [TEST 07] Polling business details processing...');
        
        await pollWithRetry(
            request,
            `${urls.privo}/api/v1/poll`,
            { 'Authorization': token },
            { app_form_id: appFormId, type: "business_details" },
            bizPoll(appFormId)
        );
        
        console.log('✅ [TEST 07] Business details processing completed successfully');
    });

    test('08 getBank - Retrieve Bank Report', async ({ request }) => {
        const res = await makeAPICall(
            request, 
            'GET',
            `${urls.morpheus}/api/v2/appForm/${appFormId}/bankReport`, 
            { headers: { 'Authorization': auth } }
        );
        
        expect(res.status()).toBe(200);
        console.log('✅ [TEST 08] Bank report retrieval completed successfully');
    });

    test('09 initiateBank - Initiate Bank Report', async ({ request }) => {
        const payload = initiateBank();
        console.log('📤 [TEST 09] Initiating bank report:', JSON.stringify(payload, null, 2));

        const res = await request.post(
            `${urls.morpheus}/api/v2/appForm/${appFormId}/bankReport/initiate`, 
            {
                headers: { 'Authorization': auth },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        const json = await res.json();
        reportId = json.responseBody?.bankReport?.reportId;
        htmlFile = json.responseBody?.vendorDetails?.htmlSnippet;
        
        expect(reportId).toBeDefined();
        console.log(`✅ [TEST 09] Bank report initiated successfully. ReportId: ${reportId}`);
    });

    test('10 AutoSubmit (UI)', async ({ page }) => {
        if (!htmlFile) {
            throw new Error('HTML file snippet not available from previous test');
        }
        
        const dataUrl = `data:text/html;base64,${Buffer.from(htmlFile).toString('base64')}`;
        await page.goto(dataUrl);
        
        await page.waitForSelector('button:has-text("Proceed")', { timeout: 10000 });
        await page.click('button:has-text("Proceed")');
        await page.waitForTimeout(2000);
        
        await page.fill('#floatingInput', 'acme');
        await page.fill('#floatingPassword', 'acme');
        await page.click('button:has-text("Login")');
        
        await page.waitForLoadState('networkidle');
        console.log('✅ [TEST 10] Automated bank login and submission completed successfully');
    });

    test('11 bankPolling', async ({ request }) => {
        console.log('⏳ [TEST 11] Polling bank report processing...');
        
        await pollWithRetry(
            request,
            `${urls.privo}/api/v1/poll`,
            { 'Authorization': token },
            { app_form_id: appFormId, type: "bank_report" },
            bankPoll(reportId)
        );
        
        console.log('✅ [TEST 11] Bank report processing completed successfully');
    });

    test('12 bankCompleted - Mark Bank Details Complete', async ({ request }) => {
        const payload = bankStatus(appFormId);
        
        const res = await request.post(
            `${urls.morpheus}/api/v1/business/appForm/${appFormId}/bankingDetails`, 
            {
                headers: { 'Authorization': auth },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 12] Bank details submission completed successfully');
    });

    test('13 ioPolling', async ({ request }) => {
        console.log('⏳ [TEST 13] Polling initial offer processing...');
        
        await pollWithRetry(
            request,
            `${urls.privo}/api/v1/poll`,
            { 'Authorization': token },
            { app_form_id: appFormId, type: "business_initial_offer" },
            ioPoll(appFormId)
        );
        
        console.log('✅ [TEST 13] Initial offer processing completed successfully');
    });

    test('14 getOffer', async ({ request }) => {
        const res = await makeAPICall(
            request, 
            'GET',
            `${urls.morpheus}/api/v1/business/appForm/${appFormId}/initialOffer`, 
            { headers: { 'Authorization': auth } }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 14] Initial offer retrieval completed successfully');
    });

    test('15 acceptOffer', async ({ request }) => {
        const res = await request.post(
            `${urls.morpheus}/api/v1/business/appForm/${appFormId}/initialOffer/accept`, 
            {
                headers: { 'Authorization': auth }
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 15] Offer acceptance completed successfully');
    });

    test('16 KYC', async ({ request }) => {
        const payload = kyc();
        
        const res = await request.put(
            `${urls.morpheus}/api/v1/appForm/${appFormId}/kyc`, 
            {
                headers: { 'Authorization': auth },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 16] KYC verification completed successfully');
    });

    test('17 selfie', async ({ request }) => {
        const payload = selfie();
        
        const res = await request.post(
            `${urls.morpheus}/api/v1/appForm/${appFormId}/selfie`, 
            {
                headers: { 'Authorization': auth },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 17] Selfie upload completed successfully');
    });

    test('18 acceptConsent', async ({ request }) => {
        const payload = consent();
        
        const res = await request.post(
            `${urls.morpheus}/api/v1/business/appForm/${appFormId}/document/consent`, 
            {
                headers: { 'Authorization': auth },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 18] Document consent acceptance completed successfully');
    });

    test('19 additionalDetails', async ({ request }) => {
        const payload = additionalDetails();
        
        const res = await request.post(
            `${urls.morpheus}/api/v1/business/appForm/${appFormId}/additionalBusinessDetails`, 
            {
                headers: { 'Authorization': auth },
                data: payload
            }
        );
        
        expect(res.ok()).toBeTruthy();
        console.log('✅ [TEST 19] Additional business details submission completed successfully');
    });

    test('20 WORKFLOW_COMPLETE - End-to-End Summary', async () => {
        console.log('\n========================================');
        console.log('🎉 WORKFLOW COMPLETE - SUMMARY');
        console.log('========================================');
        console.log(`✅ AppFormId: ${appFormId}`);
        console.log(`✅ Applicant: ${name} | PAN: ${pan}`);
        console.log(`✅ Business: ${bizName} | PAN: ${bizPan}`);
        console.log(`✅ Bank Report: ${reportId}`);
        console.log('✅ All KYC & Documentation stages completed');
        console.log('✅ Ready for disbursement\n');
    });
});