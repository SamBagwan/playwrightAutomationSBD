# Sole Proprietor DSA Flow - Complete Test Guide

## 🎯 Overview
End-to-end automated testing for the Sole Proprietor DSA (Direct Selling Agent) application workflow on Credit Saison platform.

## 📋 Test Summary
**Total Tests**: 21 test cases (Tests 00-20)
**Flow**: Sequential - each test depends on the previous one
**Duration**: ~5-10 minutes (including polling waits)

## 🔧 What's Been Fixed

### 1. **Request Body Payloads** (`requestBody.js`)
- ✅ Fixed field names to match API expectations (e.g., `pan` instead of `panNumber`)
- ✅ Added complete required fields for each API endpoint
- ✅ Proper structure for nested objects (applicant, business, banking details)
- ✅ Correct data types and formats

### 2. **Error Handling & Retry Logic** (`SolePropFlow.spec.js`)
- ✅ Added `pollWithRetry()` helper function with configurable retries (max 24 attempts)
- ✅ Added `makeAPICall()` helper for consistent error handling
- ✅ Detailed error messages with response bodies for debugging
- ✅ Timeout detection for polling operations
- ✅ Try-catch blocks for graceful failure handling

### 3. **Test Data Generation** (`panGenerator.js`)
- ✅ Valid Indian PAN format (AAAAA9999A)
- ✅ Indian names for better test authenticity
- ✅ Documented field requirements

### 4. **Test Cases Added/Enhanced**
- ✅ TEST 00: Application form cleanup (with non-critical error handling)
- ✅ TEST 01: Prerequisite data generation
- ✅ TEST 02: KYC verification via Mystique API (corrected payload)
- ✅ TEST 03-04: Personal details submission & polling
- ✅ TEST 05-07: Business details submission & polling
- ✅ TEST 08-11: Bank report workflow
- ✅ TEST 12-15: Offer acceptance workflow
- ✅ TEST 16-19: KYC, Selfie, Consent, Additional Details
- ✅ TEST 20: End-to-end workflow summary (new comprehensive test)

## 🚀 How to Run

### Prerequisites
```bash
# Install dependencies
npm install @playwright/test

# Ensure you have Node.js 14+ installed
node --version
```

### Run Full Test Suite
```bash
# Run all tests
npx playwright test tests/SolePropFlow.spec.js

# Run with detailed output
npx playwright test tests/SolePropFlow.spec.js --reporter=verbose

# Run with HTML report
npx playwright test tests/SolePropFlow.spec.js --reporter=html
# View report: npx playwright show-report
```

### Run Individual Tests
```bash
# Run specific test
npx playwright test tests/SolePropFlow.spec.js -g "02 mystique"

# Run tests matching pattern
npx playwright test tests/SolePropFlow.spec.js -g "polling"
```

### Debug Mode
```bash
# Run with debug output
npx playwright test tests/SolePropFlow.spec.js --debug

# Run with headed mode (see browser)
npx playwright test tests/SolePropFlow.spec.js --headed
```

## 📊 Test Execution Flow

```
TEST 00: Cleanup
    ↓
TEST 01: Generate Data (PAN, Name)
    ↓
TEST 02: KYC Verification (Mystique API)
    ↓
TEST 03: Create AppForm (Personal Details)
    ↓
TEST 04: Poll Personal Details
    ↓
TEST 05: Generate Business Data
    ↓
TEST 06: Submit Business Details
    ↓
TEST 07: Poll Business Details
    ↓
TEST 08: Get Bank Report
    ↓
TEST 09: Initiate Bank Report
    ↓
TEST 10: Auto-Submit Bank Login (UI)
    ↓
TEST 11: Poll Bank Report
    ↓
TEST 12: Mark Banking Complete
    ↓
TEST 13: Poll Initial Offer
    ↓
TEST 14: Get Offer
    ↓
TEST 15: Accept Offer
    ↓
TEST 16: KYC Verification
    ↓
TEST 17: Selfie Upload
    ↓
TEST 18: Accept Consent
    ↓
TEST 19: Additional Details
    ↓
TEST 20: Workflow Summary (Success)
```

## 📝 Expected Output

### Successful Run
```
✅ [TEST 00] Application form cleanup completed successfully
📋 [TEST 01] Generated PAN: EZTFK2225N, Name: Rajesh Singh
📤 [TEST 02] Sending KYC payload...
✅ [TEST 02] KYC verification successful
✅ [TEST 03] Personal details submitted successfully. AppFormId: abc-123-xyz
⏳ [TEST 04] Polling personal details processing...
✅ [TEST 04] Personal details processing completed successfully
...
🎉 WORKFLOW COMPLETE - SUMMARY
========================================
✅ AppFormId: abc-123-xyz
✅ Applicant: Rajesh Singh | PAN: EZTFK2225N
✅ Business: Sameer Enterprise | PAN: AABCD1234E
✅ Bank Report: report-id-123
✅ All KYC & Documentation stages completed
✅ Ready for disbursement
```

## 🔐 Credentials Used

| Component | Endpoint | Auth Method |
|-----------|----------|------------|
| Morpheus | https://morpheus.uat.creditsaison.corp | Basic Auth |
| Privo | https://privoapi.uat.creditsaison.xyz | Bearer Token |
| Mystique | https://mystique.uat.creditsaison.corp | API Key |

**Note**: Credentials in the spec file are for UAT environment only.

## 🐛 Common Issues & Solutions

### Issue: Mystique API Error 400
**Cause**: Invalid request payload structure
**Solution**: 
- Verify field names match API documentation
- Check `requestBody.mystiqueData()` is using `pan` not `panNumber`
- Ensure all required fields are present

### Issue: Polling Timeout
**Cause**: Processing taking longer than expected
**Solution**:
- Increase retry attempts in `pollWithRetry()` maxRetries parameter
- Check network connectivity to APIs
- Verify token expiration (should be valid for 1 hour)

### Issue: AppFormId undefined
**Cause**: Personal details test failed
**Solution**:
- Check personalDetails() payload has all required fields
- Verify authorization headers are correct
- Check Morpheus API is accessible

### Issue: HTML Snippet Missing
**Cause**: Bank report initiation failed
**Solution**:
- Verify initiateBank() payload has bank_type and months_required
- Check bank_name is valid IFSC code
- Ensure previous tests completed successfully

## 📊 Key Improvements Made

| Aspect | Before | After |
|--------|--------|-------|
| **Error Handling** | Basic expect() | Try-catch + detailed logs |
| **API Retries** | Fixed timeouts | Dynamic retry with backoff |
| **Request Payloads** | Incomplete fields | Full, validated payloads |
| **Logging** | Minimal logs | Professional step-by-step logs |
| **Test Assertions** | Limited checks | Comprehensive validations |
| **Data Generation** | Random strings | Valid Indian formats |

## 🎓 Best Practices Implemented

✅ Sequential test execution with dependencies  
✅ Helper functions for common API operations  
✅ Retry logic with exponential backoff  
✅ Professional logging with emojis for clarity  
✅ Data validation at each step  
✅ Proper error messages with context  
✅ End-to-end workflow summary  

## 📞 Support

For issues, check:
1. API endpoint URLs are correct
2. Authentication credentials are valid
3. Network connectivity to UAT environment
4. Test data in `test-data.json` is valid

---

**Last Updated**: 9 April 2026  
**Test Suite Version**: 2.0 (Comprehensive)  
**Status**: ✅ Ready for End-to-End Testing