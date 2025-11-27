// 지출결의서 카드 컴포넌트

import Link from 'next/link';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Badge from './ui/Badge';

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
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

  return (
    <Link href={`/dashboard/expenses/${expense.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{expense.merchant_name}</h3>
            <p className="text-sm text-gray-500">{formatDate(expense.expense_date)}</p>
          </div>
          <Badge variant={statusColors[expense.status]}>
            {statusLabels[expense.status]}
          </Badge>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{expense.category}</p>
            {expense.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{expense.description}</p>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
        </div>
      </div>
    </Link>
  );
}

