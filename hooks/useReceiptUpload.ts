// 영수증 업로드 상태 관리 커스텀 훅

import { useState, useCallback } from "react";
import { ExpenseFormData } from "@/lib/types";

/**
 * 영수증 업로드 및 AI 분석 완료 상태 관리 훅
 */
export function useReceiptUpload() {
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // AI 분석 완료 후 폼 데이터 설정
  const handleAnalysisComplete = useCallback(
    (data: ExpenseFormData, file: File) => {
      console.log("handleAnalysisComplete 호출됨:", { data, file });
      try {
        setFormData(data);
        setReceiptFile(file);
        setShowUpload(false);
        console.log("상태 업데이트 완료");
      } catch (error) {
        console.error("상태 업데이트 오류:", error);
      }
    },
    []
  );

  // 상태 초기화
  const reset = useCallback(() => {
    setFormData(null);
    setReceiptFile(null);
    setShowUpload(false);
  }, []);

  return {
    showUpload,
    formData,
    receiptFile,
    setShowUpload,
    handleAnalysisComplete,
    reset,
  };
}
