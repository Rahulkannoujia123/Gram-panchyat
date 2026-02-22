import { colors } from '../utils/colors';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  count = 1,
  className = '',
}: SkeletonProps) {
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  const skeletonStyle = {
    width: widthValue,
    height: heightValue,
    borderRadius,
    backgroundColor: colors.neutral.light,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={skeletonStyle} className="mb-3" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: colors.neutral.white,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        marginBottom: '12px',
      }}
    >
      <Skeleton height={24} width="70%" className="mb-3" />
      <Skeleton height={16} width="100%" count={2} className="mb-3" />
      <Skeleton height={12} width="40%" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
