// 지출결의서 리스트 아이템 스켈레톤 컴포넌트

import Skeleton from './ui/Skeleton';

export default function ExpenseListSkeletonItem() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-5 w-32" variant="text" />
          <Skeleton className="h-5 w-16 rounded-full" variant="circular" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" variant="text" />
          <Skeleton className="h-4 w-1" variant="text" />
          <Skeleton className="h-4 w-20" variant="text" />
          <Skeleton className="h-4 w-1" variant="text" />
          <Skeleton className="h-4 w-32" variant="text" />
        </div>
      </div>
      <div className="ml-4 shrink-0">
        <Skeleton className="h-6 w-24" variant="text" />
      </div>
    </div>
  );
}

