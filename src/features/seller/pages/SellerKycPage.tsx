import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import {
  getMyKyc,
  submitSellerKyc,
  uploadKycDocument,
} from "../api/sellerKycApi";
import type {
  SellerKyc,
  SellerKycSubmission,
} from "../types/sellerKyc";
import {
  CheckIcon,
  ShieldCheckIcon,
  CameraIcon,
  UploadIcon,
  FileTextIcon,
  BuildingIcon,
  CreditCardIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CloseIcon,
  EditIcon,
} from "../../../components/common/Icons";

export default function SellerKycPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [kycData, setKycData] = useState<SellerKyc | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload states
  const [uploadingIdDoc, setUploadingIdDoc] = useState(false);
  const [uploadingBusinessDoc, setUploadingBusinessDoc] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [uploadingAddressDoc, setUploadingAddressDoc] = useState(false);
  const [uploadingBankDoc, setUploadingBankDoc] = useState(false);

  // Form State
  const [form, setForm] = useState<SellerKycSubmission>({
    companyName: "",
    storeName: "",
    // Step 1
    idType: "Aadhaar Card",
    idNumber: "",
    idDocumentUrl: "",
    gstin: "",
    panNumber: "",
    businessDocumentUrl: "",
    // Step 2
    selfieImageUrl: "",
    // Step 4
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressProofDocumentUrl: "",
    // Step 5
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankProofDocumentUrl: "",
  });

  useEffect(() => {
    loadKyc();
  }, []);

  const loadKyc = async () => {
    try {
      setLoading(true);
      const data = await getMyKyc();
      if (data) {
        setKycData(data);
        setForm({
          companyName: data.companyName || "",
          storeName: data.storeName || "",
          idType: data.idType || "Aadhaar Card",
          idNumber: data.idNumber || "",
          idDocumentUrl: data.idDocumentUrl || "",
          gstin: data.gstin || "",
          panNumber: data.panNumber || "",
          businessDocumentUrl: data.businessDocumentUrl || "",
          selfieImageUrl: data.selfieImageUrl || "",
          addressLine: data.addressLine || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          country: data.country || "India",
          addressProofDocumentUrl: data.addressProofDocumentUrl || "",
          bankName: data.bankName || "",
          accountHolderName: data.accountHolderName || "",
          accountNumber: data.accountNumber || "",
          ifscCode: data.ifscCode || "",
          bankProofDocumentUrl: data.bankProofDocumentUrl || "",
        });
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (err: any) {
      console.error("Error loading KYC:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (kycData) {
      setForm({
        companyName: kycData.companyName || "",
        storeName: kycData.storeName || "",
        idType: kycData.idType || "Aadhaar Card",
        idNumber: kycData.idNumber || "",
        idDocumentUrl: kycData.idDocumentUrl || "",
        gstin: kycData.gstin || "",
        panNumber: kycData.panNumber || "",
        businessDocumentUrl: kycData.businessDocumentUrl || "",
        selfieImageUrl: kycData.selfieImageUrl || "",
        addressLine: kycData.addressLine || "",
        city: kycData.city || "",
        state: kycData.state || "",
        pincode: kycData.pincode || "",
        country: kycData.country || "India",
        addressProofDocumentUrl: kycData.addressProofDocumentUrl || "",
        bankName: kycData.bankName || "",
        accountHolderName: kycData.accountHolderName || "",
        accountNumber: kycData.accountNumber || "",
        ifscCode: kycData.ifscCode || "",
        bankProofDocumentUrl: kycData.bankProofDocumentUrl || "",
      });
    }
    setIsEditing(false);
    setErrorMessage(null);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const handleFileUpload = async (
    file: File,
    setUploadState: (val: boolean) => void,
    field: keyof SellerKycSubmission
  ) => {
    try {
      setUploadState(true);
      setErrorMessage(null);
      const url = await uploadKycDocument(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to upload file. Please try again."
      );
    } finally {
      setUploadState(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!form.companyName.trim() || !form.storeName.trim()) {
      setErrorMessage("Company name and store display name are required.");
      return;
    }
    if (!form.idNumber.trim() || !form.idDocumentUrl) {
      setErrorMessage("Please complete Step 1: ID number and government ID document are required.");
      return;
    }
    if (!form.gstin.trim() || !form.panNumber.trim()) {
      setErrorMessage("Please complete Step 1: GSTIN and PAN numbers are required.");
      return;
    }
    if (!form.selfieImageUrl) {
      setErrorMessage("Please complete Step 2: Facial recognition selfie upload is required.");
      return;
    }
    if (!form.addressLine.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim() || !form.addressProofDocumentUrl) {
      setErrorMessage("Please complete Step 4: Full address and proof document are required.");
      return;
    }
    if (!form.bankName.trim() || !form.accountHolderName.trim() || !form.accountNumber.trim() || !form.ifscCode.trim() || !form.bankProofDocumentUrl) {
      setErrorMessage("Please complete Step 5: Bank account details and proof document are required.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitSellerKyc(form);
      setKycData(res);
      setIsEditing(false);
      setSuccessMessage(
        kycData
          ? "KYC application updated and resubmitted successfully! Admin will review your updated details."
          : "KYC application submitted successfully! Admin will review each verification step."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Failed to submit KYC application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
            <AlertCircleIcon className="w-3.5 h-3.5 text-rose-600" />
            Rejected (Action Required)
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
            Under Review
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading Seller KYC Portal...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isApproved = kycData?.overallStatus === "APPROVED";
  const isActionRequired = kycData?.overallStatus === "ACTION_REQUIRED";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3 ring-1 ring-indigo-500/20">
            <ShieldCheckIcon className="w-4 h-4 text-indigo-600" />
            <span>Amazon Seller Compliance Model</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Seller KYC & Identity Verification
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Complete the 4 mandatory Amazon-style verification steps to activate your seller account and start listing products.
          </p>
        </div>

        {/* Sticky Verification Message & Status Bar */}
        {(successMessage || errorMessage || kycData) && (
          <div className="sticky top-[73px] sm:top-[85px] z-40 mb-8 space-y-3 py-1">
            {/* Success Alert */}
            {successMessage && (
              <div className="rounded-2xl bg-emerald-50/95 border border-emerald-200/90 p-3.5 sm:p-4 text-sm text-emerald-900 flex items-start justify-between gap-3 shadow-lg shadow-emerald-950/5 backdrop-blur-md">
                <div className="flex items-start gap-2.5">
                  <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Application Received</p>
                    <p className="mt-0.5 text-xs text-emerald-800">{successMessage}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-100 transition"
                  title="Dismiss"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="rounded-2xl bg-rose-50/95 border border-rose-200/90 p-3.5 sm:p-4 text-sm text-rose-900 flex items-start justify-between gap-3 shadow-lg shadow-rose-950/5 backdrop-blur-md">
                <div className="flex items-start gap-2.5">
                  <AlertCircleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Verification Notice</p>
                    <p className="mt-0.5 text-xs text-rose-800">{errorMessage}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="rounded-lg p-1 text-rose-600 hover:bg-rose-100 transition"
                  title="Dismiss"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Global Overall Status Card (Sticky on Scroll) */}
            {kycData && (
              <div
                className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 shadow-lg shadow-slate-900/5 backdrop-blur-md transition-all duration-200 ${
                  isApproved
                    ? "bg-emerald-50/95 border-emerald-200 text-emerald-950"
                    : isActionRequired
                    ? "bg-rose-50/95 border-rose-200 text-rose-950"
                    : "bg-amber-50/95 border-amber-200 text-amber-950"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        isApproved
                          ? "bg-emerald-200/80 text-emerald-800"
                          : isActionRequired
                          ? "bg-rose-200/80 text-rose-800"
                          : "bg-amber-200/80 text-amber-800"
                      }`}
                    >
                      {isApproved ? (
                        <CheckIcon className="w-5 h-5 text-emerald-700" />
                      ) : isActionRequired ? (
                        <AlertCircleIcon className="w-5 h-5 text-rose-700" />
                      ) : (
                        <ShieldCheckIcon className="w-5 h-5 text-amber-700" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Verification Status:
                        </span>
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                            isApproved
                              ? "bg-emerald-200/70 text-emerald-800"
                              : isActionRequired
                              ? "bg-rose-200/70 text-rose-800"
                              : "bg-amber-200/70 text-amber-800"
                          }`}
                        >
                          {kycData.overallStatus.replace("_", " ")}
                        </span>
                      </div>

                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                        {isApproved
                          ? "Account Active & Verified — Ready to Sell Products"
                          : isActionRequired
                          ? "Action Required: Check rejected step(s) below and resubmit"
                          : "Verification Under Review — Pending Compliance Confirmation"}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    {/* Live step indicators */}
                    <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-xl border border-slate-200/70 text-xs shadow-xs">
                      <span className="text-[10px] font-bold text-slate-500 mr-0.5">Steps:</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${kycData.step1Status === "VERIFIED" ? "bg-emerald-500" : kycData.step1Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 1: ID & Tax" />
                      <span className={`h-2.5 w-2.5 rounded-full ${kycData.step2Status === "VERIFIED" ? "bg-emerald-500" : kycData.step2Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 2: Biometric Selfie" />
                      <span className={`h-2.5 w-2.5 rounded-full ${kycData.step4Status === "VERIFIED" ? "bg-emerald-500" : kycData.step4Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 4: Address" />
                      <span className={`h-2.5 w-2.5 rounded-full ${kycData.step5Status === "VERIFIED" ? "bg-emerald-500" : kycData.step5Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 5: Bank" />
                    </div>

                    {isApproved && (
                      <Link
                        to="/seller/products"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                      >
                        <span>Seller Portal</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Action & Mode Toolbar (Shown when KYC has been submitted) */}
        {kycData && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isEditing ? "bg-amber-100 text-amber-700" : "bg-indigo-50 text-indigo-600"
                }`}
              >
                {isEditing ? <EditIcon className="w-5 h-5" /> : <FileTextIcon className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {isEditing ? "KYC Application Editor" : "Official KYC Verification Document"}
                  </h3>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isEditing ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isEditing ? "Edit Mode" : "Read-Only"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isEditing
                    ? "Update your business details or re-upload documents below, then click Resubmit."
                    : `Application Reference #${kycData.id} • Submitted on ${formatDate(kycData.createdAt)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {!isEditing ? (
                !isApproved && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setSuccessMessage(null);
                      setErrorMessage(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Edit KYC Application</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                  <span>Cancel Editing</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* View Mode Switching: Uneditable Static Document vs Editable Form */}
        {kycData && !isEditing ? (
          /* ================= UNEDITABLE STATIC DOCUMENT VIEW ================= */
          <div className="space-y-8">
            {/* General Business Info (Read-Only) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-black">
                  <BuildingIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Business & Store Profile</h3>
                  <p className="text-xs text-slate-500">Your public store identity and registered legal entity</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Legal Company Name
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.companyName}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Store Display Name
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.storeName}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Registered Email
                  </span>
                  <p className="text-sm font-semibold text-slate-900 truncate">{kycData.userEmail}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Contact Phone
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.userPhone || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Step 1: Document Upload & Business Data Matching (Read-Only) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Step 1: Document Upload & Business Data Matching
                    </h3>
                    <p className="text-xs text-slate-500">
                      Government Photo ID, Permanent Account Number (PAN), and GSTIN
                    </p>
                  </div>
                </div>
                {renderStatusBadge(kycData.step1Status)}
              </div>

              {kycData.step1Status === "REJECTED" && (
                <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                  <span className="font-bold">Admin Feedback: </span>
                  {kycData.step1RejectionReason || "Details did not match provided government documents."}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="font-bold text-rose-700 underline underline-offset-2 hover:text-rose-900"
                    >
                      Click here to edit and re-upload Step 1 documents →
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Government ID Type
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.idType}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Government ID Number
                  </span>
                  <p className="text-sm font-mono font-semibold text-slate-900">{kycData.idNumber}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    PAN Number
                  </span>
                  <p className="text-sm font-mono font-semibold text-slate-900">{kycData.panNumber}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    GSTIN
                  </span>
                  <p className="text-sm font-mono font-semibold text-slate-900">{kycData.gstin}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                {kycData.idDocumentUrl && (
                  <a
                    href={kycData.idDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
                  >
                    <FileTextIcon className="w-4 h-4 text-indigo-600" />
                    <span>View Uploaded Government ID Document</span>
                  </a>
                )}

                {kycData.businessDocumentUrl && (
                  <a
                    href={kycData.businessDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    <FileTextIcon className="w-4 h-4 text-slate-500" />
                    <span>View Business Registration / GST Certificate</span>
                  </a>
                )}
              </div>
            </div>

            {/* Step 2: Facial Recognition / Biometric Selfie Check (Read-Only) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Step 2: Facial Recognition / Biometric Selfie Check
                    </h3>
                    <p className="text-xs text-slate-500">
                      A clear, well-lit photo of your face looking straight into the camera
                    </p>
                  </div>
                </div>
                {renderStatusBadge(kycData.step2Status)}
              </div>

              {kycData.step2Status === "REJECTED" && (
                <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                  <span className="font-bold">Admin Feedback: </span>
                  {kycData.step2RejectionReason || "Selfie was unclear or face did not match photo on government ID."}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="font-bold text-rose-700 underline underline-offset-2 hover:text-rose-900"
                    >
                      Click here to edit and re-upload selfie →
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative h-44 w-44 rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 shadow-sm">
                  {kycData.selfieImageUrl ? (
                    <img
                      src={kycData.selfieImageUrl}
                      alt="Applicant Biometric Selfie"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      No selfie uploaded
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                    <CheckIcon className="w-3.5 h-3.5" />
                    Biometric Photo Submitted
                  </span>
                  <p className="text-slate-600 max-w-md">
                    This photo is compared against the portrait on your registered government ID by compliance reviewers during verification.
                  </p>
                  {kycData.selfieImageUrl && (
                    <a
                      href={kycData.selfieImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline pt-1"
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                      <span>Inspect Full Resolution Selfie in New Tab</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Physical Address & Location Verification (Read-Only) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-black text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Step 4: Physical Address & Location Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Operating business address and official utility / bank address proof
                    </p>
                  </div>
                </div>
                {renderStatusBadge(kycData.step4Status)}
              </div>

              {kycData.step4Status === "REJECTED" && (
                <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                  <span className="font-bold">Admin Feedback: </span>
                  {kycData.step4RejectionReason || "Address proof document not clear or does not match stated address."}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="font-bold text-rose-700 underline underline-offset-2 hover:text-rose-900"
                    >
                      Click here to edit and re-upload address details →
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div className="sm:col-span-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Business Street Address
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.addressLine}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    City & State
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.city}, {kycData.state}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    PIN Code & Country
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.pincode} ({kycData.country})</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                {kycData.addressProofDocumentUrl && (
                  <a
                    href={kycData.addressProofDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
                  >
                    <FileTextIcon className="w-4 h-4 text-indigo-600" />
                    <span>View Address Proof Document</span>
                  </a>
                )}
              </div>
            </div>

            {/* Step 5: Bank Account & Payout Validation (Read-Only) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-black text-sm">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Step 5: Bank Account & Payout Validation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Direct disbursement account for seller proceeds and settlement
                    </p>
                  </div>
                </div>
                {renderStatusBadge(kycData.step5Status)}
              </div>

              {kycData.step5Status === "REJECTED" && (
                <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                  <span className="font-bold">Admin Feedback: </span>
                  {kycData.step5RejectionReason || "Bank account holder name does not match registered company or ID."}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="font-bold text-rose-700 underline underline-offset-2 hover:text-rose-900"
                    >
                      Click here to edit and re-upload bank details →
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Bank Name
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.bankName}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Account Holder Name
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{kycData.accountHolderName}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Bank Account Number
                  </span>
                  <p className="text-sm font-mono font-semibold text-slate-900">{kycData.accountNumber}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    IFSC Code
                  </span>
                  <p className="text-sm font-mono font-semibold text-slate-900">{kycData.ifscCode}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                {kycData.bankProofDocumentUrl && (
                  <a
                    href={kycData.bankProofDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
                  >
                    <CreditCardIcon className="w-4 h-4 text-indigo-600" />
                    <span>View Bank Proof Document / Cancelled Cheque</span>
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Edit Application Callout */}
            {!isApproved && (
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Need to modify or re-upload documents?
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Click the button to unlock the application form and make corrections to your submission.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setSuccessMessage(null);
                    setErrorMessage(null);
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>Edit KYC Application</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================= EDITABLE FORM MODE ================= */
          <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Business Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-black">
                <BuildingIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Business & Store Profile</h3>
                <p className="text-xs text-slate-500">Your public store identity and registered corporate name</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Legal Company Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={isApproved}
                  placeholder="e.g. Apex Retail Technologies Pvt Ltd"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Store Display Name (Customers see this) *
                </label>
                <input
                  type="text"
                  required
                  disabled={isApproved}
                  placeholder="e.g. Apex Store"
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* ================= STEP 1: IDENTITY & BUSINESS ================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-black text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 1: Document Upload & Business Data Matching
                  </h3>
                  <p className="text-xs text-slate-500">
                    Government Photo ID, Permanent Account Number (PAN), and GSTIN
                  </p>
                </div>
              </div>
              {kycData && renderStatusBadge(kycData.step1Status)}
            </div>

            {/* Rejection Alert */}
            {kycData?.step1Status === "REJECTED" && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                <span className="font-bold">Admin Feedback: </span>
                {kycData.step1RejectionReason || "Details did not match provided government documents."}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Government ID Type *
                </label>
                <select
                  disabled={kycData?.step1Status === "VERIFIED"}
                  value={form.idType}
                  onChange={(e) => setForm({ ...form, idType: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver's License</option>
                  <option value="Voter ID">Voter ID Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ID Number (Must match document) *
                </label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step1Status === "VERIFIED"}
                  placeholder="e.g. 1234-5678-9012"
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload Government ID Document (PDF / Image) *
                </label>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition ${kycData?.step1Status === "VERIFIED" ? "pointer-events-none opacity-50" : ""}`}>
                    <UploadIcon className="w-4 h-4 text-slate-500" />
                    <span>{uploadingIdDoc ? "Uploading..." : form.idDocumentUrl ? "Replace File" : "Choose File"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={kycData?.step1Status === "VERIFIED" || uploadingIdDoc}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setUploadingIdDoc, "idDocumentUrl");
                      }}
                    />
                  </label>
                  {form.idDocumentUrl && (
                    <a
                      href={form.idDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FileTextIcon className="w-3.5 h-3.5" />
                      View Uploaded ID
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  PAN Number (10 alphanumeric digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  disabled={kycData?.step1Status === "VERIFIED"}
                  placeholder="e.g. ABCDE1234F"
                  value={form.panNumber}
                  onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm uppercase focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  GSTIN (15 characters) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  disabled={kycData?.step1Status === "VERIFIED"}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm uppercase focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Registration / GST Certificate (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition ${kycData?.step1Status === "VERIFIED" ? "pointer-events-none opacity-50" : ""}`}>
                    <UploadIcon className="w-4 h-4 text-slate-500" />
                    <span>{uploadingBusinessDoc ? "Uploading..." : form.businessDocumentUrl ? "Replace File" : "Choose File"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={kycData?.step1Status === "VERIFIED" || uploadingBusinessDoc}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setUploadingBusinessDoc, "businessDocumentUrl");
                      }}
                    />
                  </label>
                  {form.businessDocumentUrl && (
                    <a
                      href={form.businessDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FileTextIcon className="w-3.5 h-3.5" />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 2: BIOMETRIC SELFIE ================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 2: Facial Recognition / Biometric Selfie Check
                  </h3>
                  <p className="text-xs text-slate-500">
                    A clear, well-lit photo of your face looking straight into the camera
                  </p>
                </div>
              </div>
              {kycData && renderStatusBadge(kycData.step2Status)}
            </div>

            {/* Rejection Alert */}
            {kycData?.step2Status === "REJECTED" && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                <span className="font-bold">Admin Feedback: </span>
                {kycData.step2RejectionReason || "Selfie was unclear or face did not match photo on government ID."}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative h-44 w-44 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden shrink-0">
                {form.selfieImageUrl ? (
                  <img
                    src={form.selfieImageUrl}
                    alt="Biometric Selfie"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <CameraIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">No selfie uploaded</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-xs text-slate-600">
                  Please ensure:
                </p>
                <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                  <li>Your face is completely visible without sunglasses, hats, or masks.</li>
                  <li>Good lighting with no harsh reflections or shadows.</li>
                  <li>Hold your registered ID card next to your face if requested.</li>
                </ul>

                <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition ${kycData?.step2Status === "VERIFIED" ? "pointer-events-none opacity-50" : ""}`}>
                  <CameraIcon className="w-4 h-4" />
                  <span>{uploadingSelfie ? "Uploading selfie..." : form.selfieImageUrl ? "Take / Upload Another Selfie" : "Upload Selfie Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={kycData?.step2Status === "VERIFIED" || uploadingSelfie}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, setUploadingSelfie, "selfieImageUrl");
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ================= STEP 4: ADDRESS VERIFICATION ================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-black text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 4: Physical Address & Location Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operating business address and official utility / bank address proof
                  </p>
                </div>
              </div>
              {kycData && renderStatusBadge(kycData.step4Status)}
            </div>

            {/* Rejection Alert */}
            {kycData?.step4Status === "REJECTED" && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                <span className="font-bold">Admin Feedback: </span>
                {kycData.step4RejectionReason || "Address proof document not clear or does not match stated address."}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business Street Address *
                </label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step4Status === "VERIFIED"}
                  placeholder="e.g. Unit 402, Trade Hub, Ring Road"
                  value={form.addressLine}
                  onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">City *</label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step4Status === "VERIFIED"}
                  placeholder="e.g. Bengaluru"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">State *</label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step4Status === "VERIFIED"}
                  placeholder="e.g. Karnataka"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Postal PIN Code *</label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step4Status === "VERIFIED"}
                  placeholder="e.g. 560001"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload Address Proof (Electricity Bill / Rent Agreement / Bank Statement) *
                </label>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition ${kycData?.step4Status === "VERIFIED" ? "pointer-events-none opacity-50" : ""}`}>
                    <UploadIcon className="w-4 h-4 text-slate-500" />
                    <span>{uploadingAddressDoc ? "Uploading..." : form.addressProofDocumentUrl ? "Replace File" : "Choose File"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={kycData?.step4Status === "VERIFIED" || uploadingAddressDoc}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setUploadingAddressDoc, "addressProofDocumentUrl");
                      }}
                    />
                  </label>
                  {form.addressProofDocumentUrl && (
                    <a
                      href={form.addressProofDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FileTextIcon className="w-3.5 h-3.5" />
                      View Address Proof
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 5: BANK ACCOUNT VALIDATION ================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-black text-sm">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 5: Bank Account & Payout Validation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct disbursement account for seller proceeds and settlement
                  </p>
                </div>
              </div>
              {kycData && renderStatusBadge(kycData.step5Status)}
            </div>

            {/* Rejection Alert */}
            {kycData?.step5Status === "REJECTED" && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
                <span className="font-bold">Admin Feedback: </span>
                {kycData.step5RejectionReason || "Bank account holder name does not match registered company or ID."}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bank Name *</label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step5Status === "VERIFIED"}
                  placeholder="e.g. HDFC Bank Ltd"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step5Status === "VERIFIED"}
                  placeholder="e.g. Apex Retail Technologies Pvt Ltd"
                  value={form.accountHolderName}
                  onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bank Account Number *</label>
                <input
                  type="text"
                  required
                  disabled={kycData?.step5Status === "VERIFIED"}
                  placeholder="e.g. 50100234908123"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">IFSC Code *</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  disabled={kycData?.step5Status === "VERIFIED"}
                  placeholder="e.g. HDFC0001234"
                  value={form.ifscCode}
                  onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm uppercase focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:bg-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload Bank Proof (Cancelled Cheque or Bank Passbook / Statement) *
                </label>
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition ${kycData?.step5Status === "VERIFIED" ? "pointer-events-none opacity-50" : ""}`}>
                    <CreditCardIcon className="w-4 h-4 text-slate-500" />
                    <span>{uploadingBankDoc ? "Uploading..." : form.bankProofDocumentUrl ? "Replace File" : "Choose File"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={kycData?.step5Status === "VERIFIED" || uploadingBankDoc}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setUploadingBankDoc, "bankProofDocumentUrl");
                      }}
                    />
                  </label>
                  {form.bankProofDocumentUrl && (
                    <a
                      href={form.bankProofDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FileTextIcon className="w-3.5 h-3.5" />
                      View Bank Proof
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Submission Buttons */}
          {!isApproved && (
            <div className="flex items-center justify-end gap-3 pt-4">
              {kycData && isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>{kycData ? "Resubmit KYC Verification" : "Submit KYC for Admin Verification"}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
