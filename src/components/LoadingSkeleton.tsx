
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800",
      className
    )}>
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
        aria-hidden="true"
      />
    </div>
  );
};
