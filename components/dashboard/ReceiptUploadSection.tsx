// 영수증 업로드 섹션 컴포넌트

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ReceiptUploadZone from "@/components/ReceiptUploadZone";
import ExpenseForm from "@/components/ExpenseForm";
import Button from "@/components/ui/Button";
import { ExpenseFormData } from "@/lib/types";

interface ReceiptUploadSectionProps {
  showUpload: boolean;
  formData: ExpenseFormData | null;
  receiptFile: File | null;
  setShowUpload: (show: boolean) => void;
  handleAnalysisComplete: (data: ExpenseFormData, file: File) => void;
  onSubmit: (data: ExpenseFormData, receiptFile: File | null) => Promise<void>;
  reset: () => void;
}

export default function ReceiptUploadSection({
  showUpload,
  formData,
  receiptFile,
  setShowUpload,
  handleAnalysisComplete,
  onSubmit,
  reset,
}: ReceiptUploadSectionProps) {
  const handleSubmit = async (data: ExpenseFormData) => {
    await onSubmit(data, receiptFile);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>영수증 업로드</CardTitle>
      </CardHeader>
      <CardContent>
        {!showUpload && !formData && (
          <Button onClick={() => setShowUpload(true)}>영수증 업로드하기</Button>
        )}

        {showUpload && !formData && (
          <div className="space-y-4">
            <ReceiptUploadZone onAnalysisComplete={handleAnalysisComplete} />
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              취소
            </Button>
          </div>
        )}

        {formData && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              AI가 작성한 지출결의서
            </h3>
            <p className="text-sm text-gray-600">
              아래 내용을 확인하고 수정한 후 제출해주세요.
            </p>
            <ExpenseForm
              initialData={formData}
              onSubmit={handleSubmit}
              onCancel={reset}
              receiptImageFile={receiptFile || undefined}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
