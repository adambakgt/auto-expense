'use client';

// 통합 대시보드 페이지
// 동적 렌더링 강제 (클라이언트 전용 라이브러리 사용으로 인해)
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import ReceiptUploadZone from '@/components/ReceiptUploadZone';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseCard from '@/components/ExpenseCard';
import Button from '@/components/ui/Button';
import { Expense, ExpenseFormData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 지출결의서 목록 불러오기
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('지출결의서 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 영수증 이미지를 Supabase Storage에 업로드
  const uploadReceiptImage = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('인증이 필요합니다.');

      // 파일명 생성 (타임스탬프 + 원본 파일명)
      const fileName = `${user.id}/${Date.now()}_${file.name}`;

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Storage 업로드 오류:', {
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
      } = supabase.storage.from('receipts').getPublicUrl(data.path);

      return publicUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  // AI 분석 완료 후 폼 데이터 설정
  const handleAnalysisComplete = async (data: ExpenseFormData, file: File) => {
    console.log('handleAnalysisComplete 호출됨:', { data, file });
    try {
      setFormData(data);
      setReceiptFile(file);
      setShowUpload(false);
      console.log('상태 업데이트 완료');
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
    }
  };

  // 지출결의서 제출
  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      // 영수증 이미지 업로드
      let imageUrl = '';
      if (receiptFile) {
        imageUrl = await uploadReceiptImage(receiptFile);
      }

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipt_image_url: imageUrl,
          ...data,
          status: 'submitted',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '제출에 실패했습니다.');
      }

      // 성공 시 목록 새로고침 및 폼 초기화
      await fetchExpenses();
      setFormData(null);
      setReceiptFile(null);
      alert('지출결의서가 제출되었습니다.');
    } catch (error: any) {
      throw error;
    }
  };

  // 통계 계산
  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.expense_date);
    const now = new Date();
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });

  const totalAmount = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>이번 달 지출 건수</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{thisMonthExpenses.length}건</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>이번 달 총 지출액</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </CardContent>
          </Card>
        </div>

        {/* 영수증 업로드 섹션 */}
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
                <h3 className="text-lg font-semibold text-gray-900">AI가 작성한 지출결의서</h3>
                <p className="text-sm text-gray-600">
                  아래 내용을 확인하고 수정한 후 제출해주세요.
                </p>
                <ExpenseForm
                  initialData={formData}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setFormData(null);
                    setReceiptFile(null);
                    setShowUpload(false);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 지출결의서 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>지출결의서 목록</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/upload-card')}
              >
                카드내역 업로드
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500">로딩 중...</p>
            ) : expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 제출한 지출결의서가 없습니다.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

