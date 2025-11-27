// 업로드 히스토리 스켈레톤 컴포넌트

import Skeleton from './ui/Skeleton';

interface UploadHistorySkeletonProps {
  count?: number;
}

export default function UploadHistorySkeleton({ count = 3 }: UploadHistorySkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-2" variant="text" />
            <Skeleton className="h-4 w-32" variant="text" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" variant="circular" />
        </div>
      ))}
    </div>
  );
}

