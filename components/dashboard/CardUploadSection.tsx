// 카드내역 업로드 섹션 컴포넌트

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import FileUpload from "@/components/ui/FileUpload";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import UploadHistorySkeleton from "@/components/UploadHistorySkeleton";
import { CardUpload } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface CardUploadSectionProps {
  cardUploads: CardUpload[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
  showCardUpload: boolean;
  setShowCardUpload: (show: boolean) => void;
  uploadCardFile: (file: File) => Promise<void>;
  setError: (error: string | null) => void;
}

export default function CardUploadSection({
  cardUploads,
  loading,
  uploading,
  error,
  showCardUpload,
  setShowCardUpload,
  uploadCardFile,
  setError,
}: CardUploadSectionProps) {
  const handleCardFileSelect = async (file: File) => {
    try {
      await uploadCardFile(file);
    } catch (err) {
      // 에러는 uploadCardFile 내부에서 처리됨
    }
  };

  const statusColors = {
    uploaded: "default",
    processing: "warning",
    completed: "success",
  } as const;

  const statusLabels = {
    uploaded: "업로드됨",
    processing: "처리 중",
    completed: "완료",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>카드내역 업로드</CardTitle>
      </CardHeader>
      <CardContent>
        {!showCardUpload ? (
          <Button onClick={() => setShowCardUpload(true)}>
            카드내역 업로드하기
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              카드 승인내역 Excel 또는 CSV 파일을 업로드하세요. (추후 자동 매칭
              기능이 추가될 예정입니다)
            </p>

            <FileUpload
              onFileSelect={handleCardFileSelect}
              accept={{
                "application/vnd.ms-excel": [".xls"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
                "text/csv": [".csv"],
              }}
              maxSize={10 * 1024 * 1024} // 10MB
              disabled={uploading}
              description="Excel (.xls, .xlsx) 또는 CSV 파일 (최대 10MB)"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {uploading && (
              <div className="text-sm text-gray-600">업로드 중...</div>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setShowCardUpload(false);
                setError(null);
              }}
            >
              취소
            </Button>
          </div>
        )}

        {/* 업로드 히스토리 */}
        {!showCardUpload && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              업로드 히스토리
            </h4>
            {loading ? (
              <UploadHistorySkeleton count={3} />
            ) : cardUploads.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">
                아직 업로드한 카드내역이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {cardUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {upload.file_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(upload.upload_date)}
                      </p>
                    </div>
                    <Badge variant={statusColors[upload.status]}>
                      {statusLabels[upload.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
