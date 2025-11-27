'use client';

// 카드내역 업로드 페이지

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { CardUpload } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

export default function CardUploadPage() {
  const router = useRouter();
  const [uploads, setUploads] = useState<CardUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await fetch('/api/card-uploads');
      if (!response.ok) throw new Error('목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setUploads(data);
    } catch (error) {
      console.error('카드내역 업로드 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // Excel/CSV 파일만 허용
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];
      const allowedExtensions = ['.xls', '.xlsx', '.csv'];

      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isValidType =
        allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

      if (!isValidType) {
        throw new Error('Excel (.xls, .xlsx) 또는 CSV 파일만 업로드 가능합니다.');
      }

      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);

      // API 호출
      const response = await fetch('/api/card-uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '업로드에 실패했습니다.');
      }

      // 성공 시 목록 새로고침
      await fetchUploads();
      alert('카드내역이 업로드되었습니다.');
    } catch (err: any) {
      setError(err.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const statusColors = {
    uploaded: 'default',
    processing: 'warning',
    completed: 'success',
  } as const;

  const statusLabels = {
    uploaded: '업로드됨',
    processing: '처리 중',
    completed: '완료',
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">카드내역 업로드</h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            대시보드로
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>카드내역 파일 업로드</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              카드 승인내역 Excel 또는 CSV 파일을 업로드하세요. (추후 자동 매칭 기능이 추가될
              예정입니다)
            </p>

            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
                  '.xlsx',
                ],
                'text/csv': ['.csv'],
              }}
              maxSize={10 * 1024 * 1024} // 10MB
              disabled={uploading}
            />

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {uploading && (
              <div className="mt-4 text-sm text-gray-600">업로드 중...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>업로드 히스토리</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">로딩 중...</p>
            ) : uploads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 업로드한 카드내역이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{upload.file_name}</p>
                      <p className="text-sm text-gray-500">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

