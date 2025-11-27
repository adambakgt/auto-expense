// 지출결의서 카드 스켈레톤 컴포넌트

import Skeleton from './ui/Skeleton';

export default function ExpenseCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" variant="text" />
          <Skeleton className="h-4 w-24" variant="text" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" variant="circular" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-3 w-20 mb-2" variant="text" />
          <Skeleton className="h-4 w-40" variant="text" />
        </div>
        <Skeleton className="h-6 w-24" variant="text" />
      </div>
    </div>
  );
}

