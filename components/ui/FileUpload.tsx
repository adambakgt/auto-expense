"use client";

// 파일 업로드 드롭존 컴포넌트

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { validateImageFile } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  description?: string; // 파일 형식 설명 (기본값: 이미지/PDF)
}

export default function FileUpload({
  onFileSelect,
  accept = { "image/*": [], "application/pdf": [".pdf"] }, // 이미지 및 PDF 허용
  maxSize = 10 * 1024 * 1024, // 10MB로 증가
  disabled = false,
  description,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // accept prop이 기본값(이미지/PDF)인 경우에만 validateImageFile 사용
      const isDefaultAccept =
        JSON.stringify(accept) ===
        JSON.stringify({ "image/*": [], "application/pdf": [".pdf"] });

      if (isDefaultAccept) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error || "파일 업로드에 실패했습니다.");
          return;
        }
      } else {
        // 카드내역 업로드 등 다른 형식의 경우 파일 크기만 확인
        const maxSizeBytes = maxSize || 10 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          setError(
            `파일 크기가 너무 큽니다. 최대 ${Math.round(
              maxSizeBytes / 1024 / 1024
            )}MB까지 업로드 가능합니다.`
          );
          return;
        }
      }

      setError(null);
      onFileSelect(file);
    },
    [onFileSelect, accept, maxSize]
  );

  const onDropRejected = useCallback(
    (fileRejections: any[]) => {
      if (fileRejections.length === 0) return;

      const rejection = fileRejections[0];
      const file = rejection.file;

      // 파일 크기 초과
      if (rejection.errors.some((e: any) => e.code === "file-too-large")) {
        setError(
          `파일 크기가 너무 큽니다. 최대 ${Math.round(
            (maxSize || 10 * 1024 * 1024) / 1024 / 1024
          )}MB까지 업로드 가능합니다.`
        );
        return;
      }

      // 지원하지 않는 파일 형식
      if (rejection.errors.some((e: any) => e.code === "file-invalid-type")) {
        // accept prop에 따라 다른 메시지 표시
        const isExcelCsv =
          accept &&
          (accept["application/vnd.ms-excel"] ||
            accept[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ] ||
            accept["text/csv"]);

        if (isExcelCsv) {
          setError(
            `지원하지 않는 파일 형식입니다. Excel (.xls, .xlsx) 또는 CSV 파일만 업로드 가능합니다. (선택한 파일: ${file.name})`
          );
        } else {
          setError(
            `지원하지 않는 파일 형식입니다. 이미지 파일 또는 PDF만 업로드 가능합니다. (선택한 파일: ${file.name})`
          );
        }
        return;
      }

      // 기타 오류
      setError(rejection.errors[0]?.message || "파일 업로드에 실패했습니다.");
    },
    [accept, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    maxSize,
    disabled,
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "파일을 여기에 놓으세요"
              : "파일을 드래그하거나 클릭하여 업로드"}
          </p>
          <p className="text-xs text-gray-500">
            {description ||
              "이미지 파일 또는 PDF (최대 10MB, HEIC/PDF 자동 변환 지원)"}
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
