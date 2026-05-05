// requestBody.js - Request body templates for API calls with proper field names and validations

export function personalDetails(name, pan) {
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
}

export function pdPoll(appFormId) {
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
}

export function businessDetails(name) {
  return {
    entityType: "PROPRIETORSHIP",
    name: name,
    ownershipType: "Company Owned",
    registrationDate: "More than 60 months ago",
    gst: "04AABCL1932G1ZZ",
    pincode: "560086"
  };
}

// Alias for backward compatibility
export const bizDetails = businessDetails;

export function bizPoll(appFormId) {
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

export function mystiqueData(pan, name) {
  return {
    input: {
      pan: pan,
      consent: "Y"
    },
    output: {
      request_id: "65d45b5a-659c-11e9-9128-cf9a3b317d19",
      result: {
        name: name
      },
      "status-code": "101"
    }
  };
}

export function businessData(businessName) {
  return {
    entityType: "PROPRIETORSHIP",
    name: businessName,
    ownershipType: "Company Owned",
    registrationDate: "48-60 months ago",
    gst: "04AABCL1932G1ZZ",
    pincode: "560086"
  };
}

export function initiateBank() {
  return {
    bankName: "ACME Bank, India",
    institutionId: 998,
    method: "netbanking",
    returnUrl: "https://privo.in"
  };
}

export function bankPoll(reportId) {
  return {
    reportId: reportId
  };
}

export function ioPoll(appFormId) {
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
}

export function ioOffer(appFormId) {
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
}

export function kyc() {
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
      maskedAadhaarNumber: "xxxx xxxx 9100",
      mobileHash: "89d642118485c7f20c3b3cafc6ec5499adfe8d04f7cba4d391b80146223bcc3b",
      address: "S/O: Anbunesan, 11/3, PALANIYAPPA COLONY, ANNDANAPATTI, Salem, 636002",
      dob: "19-09-1994",
      name: "Simon Peter Anbunesan",
      isMobileVerified: "false"
    }
  };
}

export function selfie() {
  return {
    livenessScore: 0.7195,
    selfie: "/9j/4QHlRXhpZgAATU0AKgAAAAgACAEAAAQAAAABAAABLAEQAAIAAAAHAAAAbgEBAAQAAAABAAABdQEPAAIAAAAIAAAAdYdpAAQAAAABAAAAkQESAAMAAAABAAAAAAEyAAIAAAAUAAAAfYglAAQAAAABAAABKgAAAABHTTE5MDEAT25lUGx1cwAyMDIzOjAzOjMwIDExOjI2OjA4AAAA"
  };
}

export function consent() {
  return {
    isAgreed: true
  };
}

export function additionalDetails() {
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
}

export function bankStatus(appFormId) {
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