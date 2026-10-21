export type AddressType = "HOME" | "WORK" | "OTHER";

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: AddressType;
  defaultAddress: boolean;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  addressType: AddressType;
  isDefault?: boolean;
}
