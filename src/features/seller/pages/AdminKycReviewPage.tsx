import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import {
  getAdminSubmissions,
  getAdminSubmissionById,
  verifyAdminStep,
} from "../api/sellerKycApi";
import type { SellerKyc } from "../types/sellerKyc";
import {
  CheckIcon,
  CloseIcon,
  AlertCircleIcon,
  FileTextIcon,
  CameraIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "../../../components/common/Icons";

export default function AdminKycReviewPage() {
  const [submissions, setSubmissions] = useState<SellerKyc[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<SellerKyc | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activeStepToReject, setActiveStepToReject] = useState<
    "STEP_1" | "STEP_2" | "STEP_4" | "STEP_5" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setErrorBanner(null);
      const res = await getAdminSubmissions(statusFilter);
      setSubmissions(res.content || []);
      if (res.content && res.content.length > 0 && !selectedKyc) {
        setSelectedKyc(res.content[0]);
      }
    } catch (err: any) {
      setErrorBanner("Failed to load KYC submissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = async (id: number) => {
    try {
      const data = await getAdminSubmissionById(id);
      setSelectedKyc(data);
      setSuccessBanner(null);
      setErrorBanner(null);
    } catch (err: any) {
      setErrorBanner("Failed to fetch submission details.");
    }
  };

  const handleVerifyStep = async (
    step: "STEP_1" | "STEP_2" | "STEP_4" | "STEP_5"
  ) => {
    if (!selectedKyc) return;
    try {
      setActionLoading(true);
      setErrorBanner(null);
      const updated = await verifyAdminStep(selectedKyc.id, {
        step,
        status: "VERIFIED",
      });
      setSelectedKyc(updated);
      setSuccessBanner(`${step.replace("_", " ")} marked as VERIFIED.`);
      // Update in submissions list
      setSubmissions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err: any) {
      setErrorBanner(
        err.response?.data?.message || "Failed to update step verification."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (
    step: "STEP_1" | "STEP_2" | "STEP_4" | "STEP_5"
  ) => {
    setActiveStepToReject(step);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedKyc || !activeStepToReject) return;
    if (!rejectionReason.trim()) {
      setErrorBanner("Rejection reason is required so the seller can address the issue.");
      return;
    }

    try {
      setActionLoading(true);
      const updated = await verifyAdminStep(selectedKyc.id, {
        step: activeStepToReject,
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });
      setSelectedKyc(updated);
      setRejectModalOpen(false);
      setSuccessBanner(
        `${activeStepToReject.replace("_", " ")} rejected with feedback.`
      );
      setSubmissions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err: any) {
      setErrorBanner(
        err.response?.data?.message || "Failed to reject verification step."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const renderBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckIcon className="w-3 h-3 text-emerald-600" />
            {status}
          </span>
        );
      case "REJECTED":
      case "ACTION_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
            <AlertCircleIcon className="w-3 h-3 text-rose-600" />
            {status}
          </span>
        );
      case "PENDING":
      case "PENDING_REVIEW":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
            {status}
          </span>
        );
    }
  };

  const getVerifiedStepCount = (kyc: SellerKyc) => {
    let count = 0;
    if (kyc.step1Status === "VERIFIED") count++;
    if (kyc.step2Status === "VERIFIED") count++;
    if (kyc.step4Status === "VERIFIED") count++;
    if (kyc.step5Status === "VERIFIED") count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Navigation Tabs between Admin features */}
        <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Link
            to="/admin/kyc"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/30"
          >
            <ShieldCheckIcon className="w-4 h-4 text-indigo-200" />
            <span>Seller KYC Approvals</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition"
          >
            <SparklesIcon className="w-4 h-4 text-slate-500" />
            <span>Product Categories</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white mb-2">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliance & KYC Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Seller KYC Verification Review
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Individually verify each applicant step: Identity (Step 1), Biometrics (Step 2), Address (Step 4), and Bank (Step 5).
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl self-start md:self-auto">
            {["ALL", "PENDING_REVIEW", "ACTION_REQUIRED", "APPROVED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  statusFilter === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Global Notifications */}
        {(successBanner || errorBanner) && (
          <div className="sticky top-[73px] sm:top-[85px] z-40 mb-6 space-y-2 py-1">
            {successBanner && (
              <div className="rounded-2xl bg-emerald-50/95 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-lg shadow-emerald-950/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>{successBanner}</span>
                </div>
                <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-900 p-1">
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {errorBanner && (
              <div className="rounded-2xl bg-rose-50/95 border border-rose-200 p-4 text-xs font-semibold text-rose-800 flex items-center justify-between shadow-lg shadow-rose-950/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-rose-600" />
                  <span>{errorBanner}</span>
                </div>
                <button onClick={() => setErrorBanner(null)} className="text-rose-600 hover:text-rose-900 p-1">
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Applications List */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between px-2">
              <h2 className="text-sm font-bold text-slate-900">
                Applicants Queue ({submissions.length})
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Filter: {statusFilter}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading submissions...
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No submissions found matching this filter.
              </div>
            ) : (
              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {submissions.map((sub) => {
                  const verifiedCount = getVerifiedStepCount(sub);
                  const isSelected = selectedKyc?.id === sub.id;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {sub.storeName || sub.companyName}
                        </h3>
                        {renderBadge(sub.overallStatus)}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">
                        {sub.companyName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                        {sub.userEmail}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2 text-[11px]">
                        <span className="font-semibold text-slate-600">
                          {verifiedCount} of 4 steps verified
                        </span>
                        <div className="flex gap-1">
                          <span className={`h-2 w-2 rounded-full ${sub.step1Status === "VERIFIED" ? "bg-emerald-500" : sub.step1Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 1" />
                          <span className={`h-2 w-2 rounded-full ${sub.step2Status === "VERIFIED" ? "bg-emerald-500" : sub.step2Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 2" />
                          <span className={`h-2 w-2 rounded-full ${sub.step4Status === "VERIFIED" ? "bg-emerald-500" : sub.step4Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 4" />
                          <span className={`h-2 w-2 rounded-full ${sub.step5Status === "VERIFIED" ? "bg-emerald-500" : sub.step5Status === "REJECTED" ? "bg-rose-500" : "bg-amber-400"}`} title="Step 5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Detailed Review Card */}
          <div className="lg:col-span-8 space-y-6">
            {selectedKyc ? (
              <>
                {/* Header Summary Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Application #{selectedKyc.id}
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                        {selectedKyc.storeName}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Legal Entity: <span className="font-semibold text-slate-800">{selectedKyc.companyName}</span> | User: <span className="font-semibold text-slate-800">{selectedKyc.userEmail}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Overall Status:</span>
                        {renderBadge(selectedKyc.overallStatus)}
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                        {getVerifiedStepCount(selectedKyc)} / 4 Steps Verified
                      </span>
                    </div>
                  </div>

                  {selectedKyc.overallStatus === "APPROVED" && (
                    <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
                      <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>This seller has fulfilled all Amazon KYC criteria. ROLE_SELLER has been activated.</span>
                    </div>
                  )}
                </div>

                {/* ================= STEP 1 CARD ================= */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xs">
                        1
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Step 1: Document Upload & Business Data Matching
                        </h3>
                        <p className="text-[11px] text-slate-400">Govt ID, PAN, and GSTIN matching</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderBadge(selectedKyc.step1Status)}
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={actionLoading || selectedKyc.step1Status === "VERIFIED"}
                          onClick={() => handleVerifyStep("STEP_1")}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40"
                        >
                          Verify Step
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => openRejectModal("STEP_1")}
                          className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-40"
                        >
                          Reject Step
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedKyc.step1RejectionReason && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                      <span className="font-bold">Rejection Feedback: </span>
                      {selectedKyc.step1RejectionReason}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">ID Type</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.idType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">ID Number</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.idNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">PAN Number</span>
                      <span className="font-semibold font-mono text-slate-800">{selectedKyc.panNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">GSTIN</span>
                      <span className="font-semibold font-mono text-slate-800">{selectedKyc.gstin}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
                    {selectedKyc.idDocumentUrl && (
                      <a
                        href={selectedKyc.idDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <FileTextIcon className="w-3.5 h-3.5" />
                        <span>Inspect Govt ID Document</span>
                      </a>
                    )}
                    {selectedKyc.businessDocumentUrl && (
                      <a
                        href={selectedKyc.businessDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <FileTextIcon className="w-3.5 h-3.5" />
                        <span>Inspect Business Certificate</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* ================= STEP 2 CARD ================= */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold text-xs">
                        2
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Step 2: Facial Recognition / Biometric Selfie Check
                        </h3>
                        <p className="text-[11px] text-slate-400">Match applicant's face with government photo ID</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderBadge(selectedKyc.step2Status)}
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={actionLoading || selectedKyc.step2Status === "VERIFIED"}
                          onClick={() => handleVerifyStep("STEP_2")}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40"
                        >
                          Verify Step
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => openRejectModal("STEP_2")}
                          className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-40"
                        >
                          Reject Step
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedKyc.step2RejectionReason && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                      <span className="font-bold">Rejection Feedback: </span>
                      {selectedKyc.step2RejectionReason}
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                    <div className="h-32 w-32 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                      {selectedKyc.selfieImageUrl ? (
                        <img
                          src={selectedKyc.selfieImageUrl}
                          alt="Applicant Biometric Selfie"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400">
                          No photo
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-600">
                        Check that the face is clearly recognizable, unedited, and matches the photo on the government ID in Step 1.
                      </p>
                      {selectedKyc.selfieImageUrl && (
                        <a
                          href={selectedKyc.selfieImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                        >
                          <CameraIcon className="w-3.5 h-3.5" />
                          <span>Open Full Size Selfie in New Tab</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* ================= STEP 4 CARD ================= */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold text-xs">
                        4
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Step 4: Physical Address & Location Verification
                        </h3>
                        <p className="text-[11px] text-slate-400">Registered operating address & utility/statement proof</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderBadge(selectedKyc.step4Status)}
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={actionLoading || selectedKyc.step4Status === "VERIFIED"}
                          onClick={() => handleVerifyStep("STEP_4")}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40"
                        >
                          Verify Step
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => openRejectModal("STEP_4")}
                          className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-40"
                        >
                          Reject Step
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedKyc.step4RejectionReason && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                      <span className="font-bold">Rejection Feedback: </span>
                      {selectedKyc.step4RejectionReason}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[11px]">Address Line</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.addressLine}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">City & State</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.city}, {selectedKyc.state}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Pincode & Country</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.pincode} ({selectedKyc.country})</span>
                    </div>
                  </div>

                  {selectedKyc.addressProofDocumentUrl && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <a
                        href={selectedKyc.addressProofDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <FileTextIcon className="w-3.5 h-3.5" />
                        <span>Inspect Address Proof Document</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* ================= STEP 5 CARD ================= */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
                        5
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Step 5: Bank Account & Payout Validation
                        </h3>
                        <p className="text-[11px] text-slate-400">Disbursement details and cancelled cheque proof</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderBadge(selectedKyc.step5Status)}
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={actionLoading || selectedKyc.step5Status === "VERIFIED"}
                          onClick={() => handleVerifyStep("STEP_5")}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40"
                        >
                          Verify Step
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => openRejectModal("STEP_5")}
                          className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-40"
                        >
                          Reject Step
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedKyc.step5RejectionReason && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                      <span className="font-bold">Rejection Feedback: </span>
                      {selectedKyc.step5RejectionReason}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bank Name</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Account Holder</span>
                      <span className="font-semibold text-slate-800">{selectedKyc.accountHolderName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Account Number</span>
                      <span className="font-semibold font-mono text-slate-800">{selectedKyc.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">IFSC Code</span>
                      <span className="font-semibold font-mono text-slate-800">{selectedKyc.ifscCode}</span>
                    </div>
                  </div>

                  {selectedKyc.bankProofDocumentUrl && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <a
                        href={selectedKyc.bankProofDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <CreditCardIcon className="w-3.5 h-3.5" />
                        <span>Inspect Bank Proof / Cancelled Cheque</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                Please select a submission from the queue to start reviewing.
              </div>
            )}
          </div>
        </div>

        {/* Reject Step Modal */}
        {rejectModalOpen && activeStepToReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertCircleIcon className="w-5 h-5" />
                  <h3 className="font-bold text-base text-slate-900">
                    Reject {activeStepToReject.replace("_", " ")}
                  </h3>
                </div>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Please specify the exact reason for rejecting this step. The seller will see this feedback in their portal and will be allowed to resubmit only this specific step.
              </p>

              {/* Quick Suggestion Pills */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {[
                  "Document image is blurry / unreadable",
                  "Name does not match government ID",
                  "Expired document submitted",
                  "Selfie face does not match ID photo",
                  "Invalid tax / GSTIN number",
                  "Bank account holder name mismatch",
                ].map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => setRejectionReason(sugg)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 transition"
                  >
                    {sugg}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                required
                placeholder="Enter custom rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!rejectionReason.trim() || actionLoading}
                  onClick={handleConfirmReject}
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition disabled:opacity-50"
                >
                  {actionLoading ? "Submitting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
