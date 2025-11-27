// 지출결의서 목록 스켈레톤 컴포넌트

import ExpenseCardSkeleton from './ExpenseCardSkeleton';

interface ExpenseListSkeletonProps {
  count?: number;
}

export default function ExpenseListSkeleton({ count = 6 }: ExpenseListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ExpenseCardSkeleton key={index} />
      ))}
    </div>
  );
}

