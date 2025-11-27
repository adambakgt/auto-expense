// 지출결의서 리스트 아이템 컴포넌트

import Link from 'next/link';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Badge from './ui/Badge';

interface ExpenseListItemProps {
  expense: Expense;
}

export default function ExpenseListItem({ expense }: ExpenseListItemProps) {
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{expense.merchant_name}</h3>
            <Badge variant={statusColors[expense.status]} className="shrink-0">
              {statusLabels[expense.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{formatDate(expense.expense_date)}</span>
            <span className="text-gray-400">•</span>
            <span>{expense.category}</span>
            {expense.description && (
              <>
                <span className="text-gray-400">•</span>
                <span className="truncate">{expense.description}</span>
              </>
            )}
          </div>
        </div>
        <div className="ml-4 shrink-0">
          <p className="text-lg font-bold text-gray-900 text-right">
            {formatCurrency(expense.amount)}
          </p>
        </div>
      </div>
    </Link>
  );
}

