import { api } from "../../../api/axios";
import type { ApiResponse } from "../../../types/api";
import type { PaymentResponse, VerifyPaymentRequest } from "../types/payment";

/**
 * Initialize a Razorpay payment order for an existing store order
 */
export const createPayment = async (orderId: number): Promise<PaymentResponse> => {
  const response = await api.post<ApiResponse<PaymentResponse>>(`/payments/${orderId}/create`);
  return response.data.data;
};

/**
 * Verify Razorpay payment signature after customer completes payment in modal
 */
export const verifyPayment = async (
  request: VerifyPaymentRequest
): Promise<PaymentResponse> => {
  const response = await api.post<ApiResponse<PaymentResponse>>("/payments/verify", request);
  return response.data.data;
};
