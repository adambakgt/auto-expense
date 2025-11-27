// 카드내역 업로드 관리 커스텀 훅

import { useState, useEffect, useCallback } from "react";
import { CardUpload } from "@/lib/types";

/**
 * 카드내역 업로드 목록 조회 및 파일 업로드 관리 훅
 */
export function useCardUploads() {
  const [cardUploads, setCardUploads] = useState<CardUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCardUpload, setShowCardUpload] = useState(false);

  // 카드내역 업로드 목록 불러오기
  const fetchCardUploads = useCallback(async () => {
    try {
      const response = await fetch("/api/card-uploads", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("목록을 불러오는데 실패했습니다.");
      const data = await response.json();
      setCardUploads(data);
    } catch (error) {
      console.error("카드내역 업로드 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCardUploads();
  }, [fetchCardUploads]);

  // 카드내역 파일 업로드 처리
  const uploadCardFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        // Excel/CSV 파일만 허용
        const allowedTypes = [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
        ];
        const allowedExtensions = [".xls", ".xlsx", ".csv"];

        const fileExtension = file.name
          .substring(file.name.lastIndexOf("."))
          .toLowerCase();
        const isValidType =
          allowedTypes.includes(file.type) ||
          allowedExtensions.includes(fileExtension);

        if (!isValidType) {
          throw new Error(
            "Excel (.xls, .xlsx) 또는 CSV 파일만 업로드 가능합니다."
          );
        }

        // FormData 생성
        const formData = new FormData();
        formData.append("file", file);

        // API 호출
        const response = await fetch("/api/card-uploads", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "업로드에 실패했습니다.");
        }

        // 성공 시 목록 새로고침 및 업로드 UI 닫기
        await fetchCardUploads();
        setShowCardUpload(false);
        alert("카드내역이 업로드되었습니다.");
      } catch (err: any) {
        setError(err.message || "업로드 중 오류가 발생했습니다.");
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [fetchCardUploads]
  );

  return {
    cardUploads,
    loading,
    uploading,
    error,
    showCardUpload,
    setShowCardUpload,
    uploadCardFile,
    refetch: fetchCardUploads,
    setError,
  };
}
