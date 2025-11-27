'use client';

// 지출결의서 상세 페이지

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import ExpenseForm from '@/components/ExpenseForm';
import Button from '@/components/ui/Button';
import { Expense, ExpenseFormData } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ExpenseDetailSkeleton from '@/components/ExpenseDetailSkeleton';

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchExpense(params.id as string);
    }
  }, [params.id]);

  const fetchExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`);
      if (!response.ok) throw new Error('지출결의서를 불러오는데 실패했습니다.');
      const data = await response.json();
      setExpense(data);
    } catch (error) {
      console.error('지출결의서 조회 오류:', error);
      alert('지출결의서를 불러올 수 없습니다.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData: ExpenseFormData) => {
    if (!expense) return;

    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '수정에 실패했습니다.');
      }

      const updated = await response.json();
      setExpense(updated);
      setEditing(false);
      alert('지출결의서가 수정되었습니다.');
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!expense) return;

    if (!confirm('정말 이 지출결의서를 삭제하시겠습니까?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '삭제에 실패했습니다.');
      }

      alert('지출결의서가 삭제되었습니다.');
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message || '삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <ExpenseDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!expense) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">지출결의서를 찾을 수 없습니다.</p>
      </DashboardLayout>
    );
  }

  const statusColors = {
    draft: 'default',
    submitted: 'success',
    approved: 'success',
  } as const;

  const statusLabels = {
    draft: '임시저장',
    submitted: '제출됨',
    approved: '승인됨',
  };

  const formData: ExpenseFormData = {
    expense_date: expense.expense_date,
    merchant_name: expense.merchant_name,
    amount: expense.amount,
    category: expense.category,
    account_code: expense.account_code || '',
    description: expense.description || '',
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">지출결의서 상세</h1>
          <div className="flex space-x-2">
            {!editing && (
              <>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  수정
                </Button>
                <Button variant="outline" onClick={handleDelete} disabled={deleting}>
                  {deleting ? '삭제 중...' : '삭제'}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              목록으로
            </Button>
          </div>
        </div>

        {editing ? (
          <Card>
            <CardHeader>
              <CardTitle>지출결의서 수정</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm
                initialData={formData}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
                submitLabel="수정 완료"
                receiptImageUrl={expense.receipt_image_url || undefined}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{expense.merchant_name}</CardTitle>
                <Badge variant={statusColors[expense.status]}>
                  {statusLabels[expense.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">지출 날짜</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(expense.expense_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">금액</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">지출 항목</p>
                    <p className="text-base font-medium text-gray-900">{expense.category}</p>
                  </div>
                  {expense.account_code && (
                    <div>
                      <p className="text-sm text-gray-500">계정과목</p>
                      <p className="text-base font-medium text-gray-900">
                        {expense.account_code}
                      </p>
                    </div>
                  )}
                </div>

                {expense.description && (
                  <div>
                    <p className="text-sm text-gray-500">적요</p>
                    <p className="text-base text-gray-900">{expense.description}</p>
                  </div>
                )}

                {expense.receipt_image_url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">영수증 이미지</p>
                    <img
                      src={expense.receipt_image_url}
                      alt="영수증"
                      className="max-w-full h-auto rounded-md border border-gray-200"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    생성일: {formatDate(expense.created_at)}
                  </p>
                  {expense.updated_at !== expense.created_at && (
                    <p className="text-xs text-gray-500">
                      수정일: {formatDate(expense.updated_at)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

