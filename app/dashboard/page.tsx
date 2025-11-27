"use client";

// 통합 대시보드 페이지
// 동적 렌더링 강제 (클라이언트 전용 라이브러리 사용으로 인해)
export const dynamic = "force-dynamic";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExpenseStatsSection from "@/components/dashboard/ExpenseStatsSection";
import ReceiptUploadSection from "@/components/dashboard/ReceiptUploadSection";
import ExpenseListSection from "@/components/dashboard/ExpenseListSection";
import CardUploadSection from "@/components/dashboard/CardUploadSection";
import { useExpenses } from "@/hooks/useExpenses";
import { useCardUploads } from "@/hooks/useCardUploads";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";

export default function DashboardPage() {
  // 지출결의서 관련 훅
  const { expenses, loading, submitExpense } = useExpenses();

  // 영수증 업로드 관련 훅
  const receiptUpload = useReceiptUpload();

  // 카드내역 업로드 관련 훅
  const cardUploads = useCardUploads();

  // 영수증 업로드 제출 핸들러
  const handleSubmit = async (data: any, receiptFile: File | null) => {
    await submitExpense(data, receiptFile);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ExpenseStatsSection expenses={expenses} loading={loading} />
        <ReceiptUploadSection {...receiptUpload} onSubmit={handleSubmit} />
        <ExpenseListSection expenses={expenses} loading={loading} />
        <CardUploadSection {...cardUploads} />
      </div>
    </DashboardLayout>
  );
}
