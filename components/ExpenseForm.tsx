'use client';

// 지출결의서 폼 컴포넌트

import { useState, useEffect } from 'react';
import { ExpenseFormData } from '@/lib/types';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';
import ImageModal from './ui/ImageModal';

interface ExpenseFormProps {
  initialData?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  receiptImageUrl?: string; // 영수증 이미지 URL (수정 시 서버에서 가져온 이미지)
  receiptImageFile?: File; // 영수증 이미지 파일 (업로드 시 프론트에서 선택한 파일)
}

const CATEGORIES = ['식비', '교통비', '사무용품', '통신비', '기타'];

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '제출',
  receiptImageUrl,
  receiptImageFile,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    expense_date: '',
    merchant_name: '',
    amount: 0,
    category: '기타',
    account_code: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 영수증 이미지 미리보기 설정
  useEffect(() => {
    // 서버에서 가져온 이미지 URL이 있으면 사용
    if (receiptImageUrl) {
      setPreviewUrl(receiptImageUrl);
      setImageLoading(true); // 이미지 로딩 시작
      return;
    }

    // 프론트에서 선택한 파일이 있으면 미리보기 생성
    if (receiptImageFile) {
      const url = URL.createObjectURL(receiptImageFile);
      setPreviewUrl(url);
      setImageLoading(false); // File 객체는 즉시 사용 가능

      // 클린업
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // 둘 다 없으면 미리보기 제거
    setPreviewUrl(null);
    setImageLoading(false);
  }, [receiptImageUrl, receiptImageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || '제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700 mb-1">
            지출 날짜 *
          </label>
          <input
            id="expense_date"
            type="date"
            value={formData.expense_date}
            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="merchant_name" className="block text-sm font-medium text-gray-700 mb-1">
            가맹점명 *
          </label>
          <input
            id="merchant_name"
            type="text"
            value={formData.merchant_name}
            onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="가맹점명을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            금액 *
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            지출 항목 *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="account_code" className="block text-sm font-medium text-gray-700 mb-1">
            계정과목
          </label>
          <input
            id="account_code"
            type="text"
            value={formData.account_code || ''}
            onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="선택사항"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          적요
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="지출 내용을 간단히 설명하세요"
        />
      </div>

      {/* 영수증 이미지 미리보기 */}
      {previewUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            영수증 이미지
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
              className={`max-w-full h-auto mx-auto cursor-pointer transition-opacity hover:opacity-90 ${
                imageLoading ? 'hidden' : ''
              }`}
              style={{ maxHeight: '400px' }}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              onClick={() => setIsModalOpen(true)}
              title="클릭하여 확대"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            이미지를 클릭하면 확대해서 볼 수 있습니다
          </p>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {previewUrl && (
        <ImageModal
          imageUrl={previewUrl}
          alt="영수증 이미지"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <Button type="submit" disabled={loading}>
          {loading ? '처리 중...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}

