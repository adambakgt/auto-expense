'use client';

// 영수증 업로드 영역 컴포넌트

import { useState } from 'react';
import FileUpload from './ui/FileUpload';
import LoadingOverlay from './ui/LoadingOverlay';
import { ExpenseFormData } from '@/lib/types';

interface ReceiptUploadZoneProps {
  onAnalysisComplete: (data: ExpenseFormData, file: File) => void;
}

export default function ReceiptUploadZone({ onAnalysisComplete }: ReceiptUploadZoneProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      let fileToUpload = file;

      // HEIC/HEIF 형식이면 JPEG로 변환
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const isHeic = 
        fileType.includes('heic') || 
        fileType.includes('heif') ||
        fileName.endsWith('.heic') ||
        fileName.endsWith('.heif');

      if (isHeic) {
        try {
          console.log('HEIC 파일 감지, JPEG로 변환 중...');
          // heic2any는 클라이언트 전용이므로 동적 import 사용
          const heic2any = (await import('heic2any')).default;
          // heic2any는 Blob 배열을 반환하므로 첫 번째 항목 사용
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9,
          });
          
          // 배열인 경우 첫 번째 항목 사용
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          
          // Blob을 File로 변환
          fileToUpload = new File([blob], file.name.replace(/\.heic?$/i, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          console.log('HEIC → JPEG 변환 완료');
        } catch (convertError: any) {
          console.error('HEIC 변환 오류:', convertError);
          throw new Error('HEIC 파일을 변환할 수 없습니다. iPhone 설정에서 "가장 호환되는 형식"으로 변경하거나, 사진 앱에서 JPEG로 변환 후 업로드해주세요.');
        }
      }

      // FormData 생성
      const formData = new FormData();
      formData.append('file', fileToUpload);

      // OCR API 호출
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
        console.error('OCR API 오류:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || '영수증 분석에 실패했습니다.');
      }

      const result = await response.json();
      console.log('OCR 분석 결과:', result);

      // 결과를 폼 데이터 형식으로 변환
      const expenseFormData: ExpenseFormData = {
        expense_date: result.expense_date,
        merchant_name: result.merchant_name,
        amount: result.amount,
        category: result.category,
        account_code: result.account_code || '',
        description: result.description || '',
      };

      console.log('폼 데이터 준비 완료:', expenseFormData);
      console.log('onAnalysisComplete 호출 전');
      onAnalysisComplete(expenseFormData, fileToUpload);
      console.log('onAnalysisComplete 호출 후');
    } catch (err: any) {
      setError(err.message || '영수증 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="AI가 영수증을 분석하고 있습니다..." />}
      <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
    </>
  );
}

