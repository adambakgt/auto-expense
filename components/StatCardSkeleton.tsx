// 통계 카드 스켈레톤 컴포넌트

import Skeleton from './ui/Skeleton';

export default function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <Skeleton className="h-5 w-32 mb-4" variant="text" />
      <Skeleton className="h-10 w-24" variant="text" />
    </div>
  );
}

