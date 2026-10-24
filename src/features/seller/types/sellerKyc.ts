export type KycStepStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type KycOverallStatus = 'PENDING_REVIEW' | 'ACTION_REQUIRED' | 'APPROVED' | 'REJECTED';

export interface SellerKyc {
  id: number;
  userId: number;
  userEmail: string;
  userName?: string;
  userPhone?: string;

  companyName: string;
  storeName: string;

  // Step 1: Document Upload & Business Data Matching
  idType: string;
  idNumber: string;
  idDocumentUrl: string;
  gstin: string;
  panNumber: string;
  businessDocumentUrl?: string;
  step1Status: KycStepStatus;
  step1RejectionReason?: string;

  // Step 2: Facial Recognition / Biometric Selfie Check
  selfieImageUrl: string;
  step2Status: KycStepStatus;
  step2RejectionReason?: string;

  // Step 4: Address Physical Verification
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressProofDocumentUrl: string;
  step4Status: KycStepStatus;
  step4RejectionReason?: string;

  // Step 5: Bank Account Validation
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankProofDocumentUrl: string;
  step5Status: KycStepStatus;
  step5RejectionReason?: string;

  // Overall Status
  overallStatus: KycOverallStatus;
  adminNotes?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerKycSubmission {
  companyName: string;
  storeName: string;

  // Step 1
  idType: string;
  idNumber: string;
  idDocumentUrl: string;
  gstin: string;
  panNumber: string;
  businessDocumentUrl?: string;

  // Step 2
  selfieImageUrl: string;

  // Step 4
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  addressProofDocumentUrl: string;

  // Step 5
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankProofDocumentUrl: string;
}

export interface VerifyStepRequest {
  step: 'STEP_1' | 'STEP_2' | 'STEP_4' | 'STEP_5';
  status: 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  adminNotes?: string;
}
