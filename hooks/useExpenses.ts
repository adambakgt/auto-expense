// 지출결의서 CRUD 커스텀 훅

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseFormData } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { sanitizeFileName, resizeImage } from "@/lib/utils";

/**
 * 지출결의서 목록 조회, 제출, 영수증 이미지 업로드 관리 훅
 */
export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // 지출결의서 목록 불러오기
  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch("/api/expenses", {
        credentials: "include", // 쿠키를 포함하여 인증 정보 전달
      });
      if (!response.ok) throw new Error("목록을 불러오는데 실패했습니다.");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("지출결의서 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // 영수증 이미지를 Supabase Storage에 업로드
  const uploadReceiptImage = useCallback(
    async (file: File): Promise<string> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("인증이 필요합니다.");

        // 이미지 리사이징 (최대 1920x1920, 품질 85%)
        // 용량을 줄이기 위해 업로드 전에 리사이징
        let fileToUpload = file;
        if (file.type.startsWith("image/")) {
          try {
            console.log("이미지 리사이징 시작...");
            fileToUpload = await resizeImage(file, 1920, 1920, 0.85);
            console.log("이미지 리사이징 완료");
          } catch (resizeError: any) {
            console.warn(
              "이미지 리사이징 실패, 원본 파일 사용:",
              resizeError.message
            );
            // 리사이징 실패 시 원본 파일 사용
          }
        }

        // 파일명 생성 (타임스탬프 + 안전한 파일명)
        // 한글 및 특수문자를 제거하여 URL-safe하게 처리
        const safeFileName = sanitizeFileName(fileToUpload.name);
        const fileName = `${user.id}/${Date.now()}_${safeFileName}`;

        // Supabase Storage에 업로드
        const { data, error } = await supabase.storage
          .from("receipts")
          .upload(fileName, fileToUpload, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Storage 업로드 오류:", {
            error: error.message,
            errorDetails: error,
            fileName,
            userId: user.id,
          });
          throw error;
        }

        // 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("receipts").getPublicUrl(data.path);

        return publicUrl;
      } catch (error) {
        console.error("영수증 이미지 업로드 오류:", error);
        throw error;
      }
    },
    [supabase]
  );

  // 지출결의서 제출
  const submitExpense = useCallback(
    async (data: ExpenseFormData, receiptFile: File | null) => {
      try {
        // 영수증 이미지 업로드
        let imageUrl = "";
        if (receiptFile) {
          imageUrl = await uploadReceiptImage(receiptFile);
        }

        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receipt_image_url: imageUrl,
            ...data,
            status: "submitted",
          }),
          credentials: "include", // 쿠키를 포함하여 인증 정보 전달
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "제출에 실패했습니다.");
        }

        // 성공 시 목록 새로고침
        await fetchExpenses();
        alert("지출결의서가 제출되었습니다.");
      } catch (error: any) {
        throw error;
      }
    },
    [uploadReceiptImage, fetchExpenses]
  );

  return {
    expenses,
    loading,
    submitExpense,
    uploadReceiptImage,
    refetch: fetchExpenses,
  };
}
