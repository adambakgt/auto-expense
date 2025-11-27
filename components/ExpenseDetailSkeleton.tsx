// 지출결의서 상세 스켈레톤 컴포넌트

import Skeleton from './ui/Skeleton';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export default function ExpenseDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" variant="text" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-16" variant="rectangular" />
          <Skeleton className="h-10 w-16" variant="rectangular" />
          <Skeleton className="h-10 w-24" variant="rectangular" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" variant="text" />
            <Skeleton className="h-6 w-16 rounded-full" variant="circular" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-20 mb-2" variant="text" />
                  <Skeleton className="h-5 w-32" variant="text" />
                </div>
              ))}
            </div>

            <div>
              <Skeleton className="h-4 w-16 mb-2" variant="text" />
              <Skeleton className="h-5 w-full" variant="text" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-2" variant="text" />
              <Skeleton className="h-64 w-full" variant="rectangular" />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Skeleton className="h-3 w-32" variant="text" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

