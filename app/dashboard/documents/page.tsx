"use client";

import { useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Award,
  CreditCard,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Loader2,
  ArrowRight,
  ExternalLink,
  X,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { documentService } from "@/services/document.service";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "@/types/document";
import type { DocumentType, UserDocument } from "@/types/document";

const typeIcons: Record<DocumentType, typeof FileText> = {
  LICENSE: Award,
  CERTIFICATE: FileText,
  GOVERNMENT_ID: CreditCard,
};

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

function DocumentCard({ doc }: { doc: UserDocument }) {
  const isRejected = !!doc.rejectedAt;
  const isVerified = !!doc.verifiedAt;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-sm transition-shadow"
    >
      <div className="w-14 h-14 rounded-lg bg-background-soft overflow-hidden flex-shrink-0">
        <img
          src={doc.url}
          alt={DOCUMENT_TYPE_LABELS[doc.type as DocumentType] || doc.type}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {DOCUMENT_TYPE_LABELS[doc.type as DocumentType] || doc.type}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(doc.createdAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex-shrink-0">
        {isRejected ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[11px] font-semibold text-red-600">Rejected</span>
          </div>
        ) : isVerified ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-700">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-semibold text-amber-700">Pending</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GuidedView({
  onUploadComplete,
}: {
  onUploadComplete: () => void;
}) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<DocumentType>("LICENSE");
  const selectedTypeRef = useRef(selectedType);
  selectedTypeRef.current = selectedType;
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleSuccess = useCallback(
    async (results: CloudinaryUploadWidgetResults) => {
      const info = results?.info;
      if (!info || typeof info === "string") return;
      setUploading(true);
      try {
        await documentService.upload({
          type: selectedTypeRef.current,
          url: info.secure_url,
        });
        setUploaded(true);
        toast.success("Document uploaded!");
        onUploadComplete();
      } catch {
        toast.error("Failed to save document. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete],
  );

  if (uploaded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Document Submitted</h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
          Your document has been submitted for review. An administrator will verify it.
          You can now access your dashboard.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  const Icon = typeIcons[selectedType];

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Documents</h2>
        <p className="text-sm text-muted-foreground">
          Upload at least one verification document to activate your account
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <p className="text-sm font-medium text-foreground">Document Type</p>
        <div className="grid gap-3">
          {DOCUMENT_TYPES.map((type) => {
            const TIcon = typeIcons[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-white hover:border-primary/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "bg-primary text-white" : "bg-background-soft text-muted-foreground"
                  }`}
                >
                  <TIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {DOCUMENT_TYPE_LABELS[type]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {type === "LICENSE" && "Your CHEW practice license"}
                    {type === "CERTIFICATE" && "Training or qualification certificate"}
                    {type === "GOVERNMENT_ID" && "National ID, passport, or driver's license"}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <CldUploadWidget
        uploadPreset={uploadPreset}
        onSuccess={handleSuccess}
        options={{
          clientAllowedFormats: ["jpg", "png", "pdf", "jpeg", "gif"],
          maxFileSize: 10000000,
          folder: "mama-connect/documents",
          sources: ["local", "camera", "url"],
        }}
      >
        {({ open, isLoading: cloudinaryLoading }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={uploading || cloudinaryLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {uploading || cloudinaryLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : cloudinaryLoading ? "Loading..." : `Upload ${DOCUMENT_TYPE_LABELS[selectedType]}`}
          </button>
        )}
      </CldUploadWidget>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Accepted formats: JPG, PNG, PDF. Max 10MB
      </p>
    </div>
  );
}

export default function DocumentsPage() {
  const { user } = useAuth();
  const isPending = user?.verificationStatus === "PENDING";

  const {
    data: documents = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-documents"],
    queryFn: () => documentService.list(),
    refetchInterval: 30000,
  });

  const [showNewUpload, setShowNewUpload] = useState(false);
  const [newDocType, setNewDocType] = useState<DocumentType>("LICENSE");
  const newDocTypeRef = useRef(newDocType);
  newDocTypeRef.current = newDocType;
  const [uploadingNew, setUploadingNew] = useState(false);

  const noDocuments = documents.length === 0 && !isLoading;

  const handleNewUploadSuccess = useCallback(
    async (results: CloudinaryUploadWidgetResults) => {
      const info = results?.info;
      if (!info || typeof info === "string") return;
      setUploadingNew(true);
      try {
        await documentService.upload({
          type: newDocTypeRef.current,
          url: info.secure_url,
        });
        toast.success("Document uploaded!");
        setShowNewUpload(false);
        refetch();
      } catch {
        toast.error("Failed to save document.");
      } finally {
        setUploadingNew(false);
      }
    },
    [refetch],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isPending && noDocuments) {
    return <GuidedView onUploadComplete={() => refetch()} />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {noDocuments ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-background-soft flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No documents yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Upload your professional documents to complete your profile
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showNewUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setShowNewUpload(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-2xl border border-border shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Upload Document</h2>
                <button
                  type="button"
                  onClick={() => setShowNewUpload(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-background-soft transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Document Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DOCUMENT_TYPES.map((type) => {
                      const TIcon = typeIcons[type];
                      const isSelected = newDocType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewDocType(type)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? "bg-primary text-white" : "bg-background-soft text-muted-foreground"
                            }`}
                          >
                            <TIcon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-medium text-center leading-tight ${
                            isSelected ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {DOCUMENT_TYPE_LABELS[type]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <CldUploadWidget
                  uploadPreset={uploadPreset}
                  onSuccess={handleNewUploadSuccess}
                  options={{
                    clientAllowedFormats: ["jpg", "png", "pdf", "jpeg", "gif"],
                    maxFileSize: 10000000,
                    folder: "mama-connect/documents",
                  }}
                >
                  {({ open, isLoading: clLoading }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      disabled={uploadingNew || clLoading}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {uploadingNew || clLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploadingNew ? "Uploading..." : clLoading ? "Loading..." : "Choose File"}
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}