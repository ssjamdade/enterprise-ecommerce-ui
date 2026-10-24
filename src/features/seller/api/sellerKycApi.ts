import { api } from "../../../api/axios";
import type { ApiResponse, PageResponse } from "../../../types/api";
import type {
  SellerKyc,
  SellerKycSubmission,
  VerifyStepRequest,
} from "../types/sellerKyc";

/**
 * Fetch the logged in user's Seller KYC record (or null if not submitted yet)
 */
export const getMyKyc = async (): Promise<SellerKyc | null> => {
  const response = await api.get<ApiResponse<SellerKyc | null>>("/seller/kyc/me");
  return response.data.data;
};

/**
 * Submit or re-submit the Seller KYC application
 */
export const submitSellerKyc = async (
  data: SellerKycSubmission
): Promise<SellerKyc> => {
  const response = await api.post<ApiResponse<SellerKyc>>("/seller/kyc/submit", data);
  return response.data.data;
};

/**
 * Upload a document or image file to Cloudinary via backend
 */
export const uploadKycDocument = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<{ url: string }>>(
    "/seller/kyc/upload-document",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data.url;
};

/**
 * Check if current user is an approved seller
 */
export const checkSellerStatus = async (): Promise<boolean> => {
  const response = await api.get<ApiResponse<{ approved: boolean }>>(
    "/seller/kyc/status"
  );
  return response.data.data.approved;
};

// ================= ADMIN KYC API =================

/**
 * Admin: Get all KYC submissions with pagination & status filter
 */
export const getAdminSubmissions = async (
  status?: string,
  page = 0,
  size = 10
): Promise<PageResponse<SellerKyc>> => {
  const response = await api.get<ApiResponse<PageResponse<SellerKyc>>>(
    "/admin/kyc",
    {
      params: {
        ...(status && status !== "ALL" ? { status } : {}),
        page,
        size,
      },
    }
  );
  return response.data.data;
};

/**
 * Admin: Get a specific KYC submission by ID
 */
export const getAdminSubmissionById = async (
  id: number
): Promise<SellerKyc> => {
  const response = await api.get<ApiResponse<SellerKyc>>(`/admin/kyc/${id}`);
  return response.data.data;
};

/**
 * Admin: Verify or Reject a specific step (STEP_1, STEP_2, STEP_4, STEP_5)
 */
export const verifyAdminStep = async (
  kycId: number,
  payload: VerifyStepRequest
): Promise<SellerKyc> => {
  const response = await api.post<ApiResponse<SellerKyc>>(
    `/admin/kyc/${kycId}/verify-step`,
    payload
  );
  return response.data.data;
};
