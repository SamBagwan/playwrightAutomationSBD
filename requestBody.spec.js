// requestBodySoleprop.js

const RequestBodySoleprop = {
  personalDetails(name, pan) {
    return {
      firstName: name,
      middleName: "",
      lastName: "Tukaram",
      dob: "1990-09-21",
      panCardId: pan,
      pinCode: "411001",
      personalEmail: "sameer.bagwan@creditsaison-in.com",
      phoneNumber: "9898334455",
      ownership: "Rented",
      employmentType: "Business Owner",
      residenceType: "Self Owned",
      requestedAmount: 250000,
      requestedTenure: 12,
      purpose: "Other"
    };
  },

  personalDetailsPolling(appFormId) {
    return {
      on_complete: "LOAN_BUSINESS_DETAILS",
      possible_screens: [
        {
          product_code: "SBD",
          app_state: "44",
          app_stage: "LOAN_BUSINESS_DETAILS",
          on_submit: {
            request_url: `/mrp/api/v1/business/appForm/${appFormId}/businessDetails`,
            request_type: "POST"
          },
          on_error: "retry_dialog",
          on_reject: "reject_stage"
        }
      ]
    };
  },

  businessDetails(name) {
    return {
      entityType: "PROPRIETORSHIP",
      name: name,
      ownershipType: "Company Owned",
      registrationDate: "More than 60 months ago",
      gst: "04AABCL1932G1ZZ",
      pincode: "560086"
    };
  },

  businessPolling(appFormId) {
    return {
      on_complete: "LOAN_BANKING_DETAILS",
      possible_screens: [
        {
          product_code: "SBD",
          app_state: "47",
          app_stage: "LOAN_BANKING_DETAILS",
          on_submit: {
            request_url: `/mrp/api/v1/business/appForm/${appFormId}/bankingDetails`,
            request_type: "POST"
          },
          on_error: "retry_dialog",
          on_reject: "reject_stage"
        }
      ]
    };
  },

  // requestBody.js
export const mystiqueData = (pan, name) => ({
    input: { 
        pan: pan.trim(), // Ensure no whitespace
        consent: "Y" 
    },
    output: { 
        request_id: "65d45b5a-659c-11e9-9128-cf9a3b317d19",
        result: { 
            name: name.trim() // REMOVED THE TRAILING SPACE HERE
        }, 
        "status-code": "101" 
    }
});


  businessData(businessName) {
    return {
      entityType: "PROPRIETORSHIP",
      name: businessName,
      ownershipType: "Company Owned",
      registrationDate: "48-60 months ago",
      gst: "04AABCL1932G1ZZ",
      pincode: "560086"
    };
  },

  initiateBank() {
    return {
      bankName: "ACME Bank, India",
      institutionId: 998,
      method: "netbanking",
      returnUrl: "[privo.in](https://privo.in)"
    };
  },

  bankPolling(reportId) {
    return {
      reportId: reportId
    };
  },

  ioOffer(appFormId) {
    return {
      on_complete: "INITIAL_OFFER_DETAILS",
      possible_screens: [
        {
          product_code: "SBD",
          app_state: "49",
          app_stage: "INITIAL_OFFER_DETAILS",
          on_submit: {
            request_url: `/mrp/api/v2/business/appForm/${appFormId}/initialOffer/accept`,
            request_type: "POST"
          },
          on_error: "retry_dialog",
          on_reject: "reject_stage"
        }
      ]
    };
  },

  KYC() {
    return {
      kyc: {
        kycType: "aadhaarCard",
        kycValue: "xxxx xxxx 9100",
        issuedCountry: "IN"
      },
      address: {
        line1: "11/3PALANIYAPPA COLONY",
        line2: "ANNDANAPATTI",
        state: "Tamil Nadu",
        city: "Salem",
        country: "IN",
        pinCode: "636002"
      },
      aadhaar: {
        code: "200",
        gender: "M",
        address_po: "Shevapet",
        address_state: "Tamil Nadu",
        isEmailVerified: "false",
        isError: "false",
        emailHash: "",
        address_loc: "",
        imagebase64: "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",
        maskedAahaarNumber: "xxxx xxxx 9100",
        maskedAadhaarNumber: "xxxx xxxx 9100",
        mobileHash: "89d642118485c7f20c3b3cafc6ec5499adfe8d04f7cba4d391b80146223bcc3b",
        address: "S/O: Anbunesan, 11/3, PALANIYAPPA COLONY, ANNDANAPATTI, Salem, 636002, Shevapet, Salem, Salem, Tamil Nadu, India",
        address_house: "11/3",
        address_country: "India",
        address_subdist: "Salem",
        address_dist: "Salem",
        address_careof: "S/O: Anbunesan",
        // Note: zipFileBase64 truncated for brevity - add full value in actual implementation
        zipFileBase64: "data:application/zip;base64,UEsDBBQACQAIABhhRFQAAAAAAAAAAAAAAAAjAAAAb2ZmbGluZWFhZGhhYXIyMDIyMDIwNDEyMDg0OTI3Mi54bWxc...",
        address_pc: "636002",
        isXmlVerify: "false",
        address_landmark: "ANNDANAPATTI",
        sharecode: "1234",
        dob: "19-09-1994",
        address_street: "PALANIYAPPA COLONY",
        address_vtc: "Salem",
        genDate: "20220204173849265",
        name: "Simon Peter Anbunesan",
        isMobileVerified: "false"
      }
    };
  },

  selfie() {
    return {
      livenessScore: 0.7195,
      selfie: "/9j/4QHlRXhpZgAATU0AKgAAAAgACAEAAAQAAAABAAABLAEQAAIAAAAHAAAAbgEBAAQAAAABAAABdQEPAAIAAAAIAAAAdYdpAAQAAAABAAAAkQESAAMAAAABAAAAAAEyAAIAAAAUAAAAfYglAAQAAAABAAABKgAAAABHTTE5MDEAT25lUGx1cwAyMDIzOjAzOjMwIDExOjI2OjA4..."
      // Note: Full base64 truncated for brevity
    };
  },

  consent() {
    return {
      isAgreed: true
    };
  },

  additionalDetails() {
    return {
      nature: "Service",
      sector: "Ceramic, Glass and Hardware (including paints)",
      udyam: "UDYAM-DL-03-0053383",
      addressDetails: [
        {
          type: "Residence",
          lineOne: "Cgfgc",
          lineTwo: "Cgfxdd",
          pincode: "400614"
        },
        {
          type: "Operational",
          lineOne: "Fhffff",
          lineTwo: "Fffgggv",
          pincode: "400614"
        },
        {
          type: "Registered",
          lineOne: "Fhffff",
          lineTwo: "Fffgggv",
          pincode: "400614"
        }
      ]
    };
  },

  bankStatus(appFormId) {
    return {
      on_complete: "LOAN_BANKING_DETAILS",
      possible_screens: [
        {
          product_code: "SBD",
          app_state: "47",
          app_stage: "LOAN_BANKING_DETAILS",
          on_submit: {
            request_url: `/mrp/api/v1/business/appForm/${appFormId}/bankingDetails`,
            request_type: "POST"
          },
          on_error: "retry_dialog",
          on_reject: "reject_stage"
        }
      ]
    };
  }
};

module.exports = RequestBodySoleprop;
