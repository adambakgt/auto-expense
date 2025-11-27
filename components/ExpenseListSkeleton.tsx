// 지출결의서 목록 스켈레톤 컴포넌트

import ExpenseCardSkeleton from './ExpenseCardSkeleton';
import ExpenseListSkeletonItem from './ExpenseListSkeletonItem';

interface ExpenseListSkeletonProps {
  count?: number;
  viewType?: 'card' | 'list';
}

export default function ExpenseListSkeleton({ count = 6, viewType = 'card' }: ExpenseListSkeletonProps) {
  if (viewType === 'list') {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {Array.from({ length: count }).map((_, index) => (
          <ExpenseListSkeletonItem key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ExpenseCardSkeleton key={index} />
      ))}
    </div>
  );
}

