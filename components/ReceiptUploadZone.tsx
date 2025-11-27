'use client';

// 영수증 업로드 영역 컴포넌트

import { useState, useEffect } from 'react';
import FileUpload from './ui/FileUpload';
import LoadingOverlay from './ui/LoadingOverlay';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';
import { ExpenseFormData } from '@/lib/types';
import { convertPdfToImage } from '@/lib/utils';

interface ReceiptUploadZoneProps {
  onAnalysisComplete: (data: ExpenseFormData, file: File) => void;
}

export default function ReceiptUploadZone({ onAnalysisComplete }: ReceiptUploadZoneProps) {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // 파일 선택 시 미리보기만 표시
  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    setSelectedFile(null);
    setPreviewUrl(null);

    try {
      let fileToUpload = file;

      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      // PDF 파일인지 확인
      const isPdf = 
        fileType === 'application/pdf' ||
        fileName.endsWith('.pdf');

      // PDF 파일이면 클라이언트에서 이미지로 변환
      if (isPdf) {
        try {
          console.log('PDF 파일 감지, 이미지로 변환 중...');
          fileToUpload = await convertPdfToImage(file);
          console.log('PDF → 이미지 변환 완료');
        } catch (convertError: any) {
          console.error('PDF 변환 오류:', convertError);
          throw new Error('PDF 파일을 이미지로 변환할 수 없습니다. 다른 형식으로 변환 후 다시 시도해주세요.');
        }
      }
      
      // HEIC/HEIF 형식이면 JPEG로 변환
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

      // 파일 저장 및 미리보기 생성
      setSelectedFile(fileToUpload);
      const url = URL.createObjectURL(fileToUpload);
      setPreviewUrl(url);
      setImageLoading(true);
    } catch (err: any) {
      setError(err.message || '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // AI 분석 시작
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', selectedFile);

      // OCR API 호출 (쿠키 포함)
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 쿠키를 포함하여 인증 정보 전달
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
      onAnalysisComplete(expenseFormData, selectedFile);
      console.log('onAnalysisComplete 호출 후');
    } catch (err: any) {
      setError(err.message || '영수증 분석 중 오류가 발생했습니다.');
    } finally {
      setAnalyzing(false);
    }
  };

  // 미리보기 URL 클린업
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      {analyzing && <LoadingOverlay message="AI가 영수증을 분석하고 있습니다..." />}
      
      {!previewUrl ? (
        <FileUpload onFileSelect={handleFileSelect} disabled={loading || analyzing} />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              업로드된 영수증 이미지
            </label>
            <div className="relative border border-gray-200 rounded-md overflow-hidden bg-gray-50">
              {imageLoading && (
                <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
                  <Skeleton className="w-full h-64" variant="rectangular" />
                </div>
              )}
              <img
                src={previewUrl}
                alt="영수증 미리보기"
                className={`max-w-full h-auto mx-auto ${imageLoading ? 'hidden' : ''}`}
                style={{ maxHeight: '400px' }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              이미지를 확인한 후 분석을 시작하세요
            </p>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleAnalyze} disabled={analyzing || !selectedFile}>
              {analyzing ? '분석 중...' : '분석 시작'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setError(null);
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
              }}
              disabled={analyzing}
            >
              다시 선택
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
    </>
  );
}

