import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const PULSE_DURATION = 1200;

/**
 * Stable keys for rendering a fixed number of placeholder rows.
 *
 * Callers map over this instead of `Array.from({ length })` because a raw
 * index key trips biome's `noArrayIndexKey` and forces remounts.
 */
export const skeletonKeys = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => `skeleton-${index}`);

type SkeletonProps = {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Loading placeholder that mirrors the shape of the content it replaces.
 *
 * The pulse is driven by Reanimated rather than Tailwind's `animate-pulse`
 * because uniwind does not compile CSS `animation` / `@keyframes` for native
 * -- only its web runtime implements them.
 */
export const Skeleton = ({ className, style, children }: SkeletonProps) => {
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: PULSE_DURATION, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      className={cn('bg-muted', className)}
      style={[pulseStyle, style]}
    >
      {children}
    </Animated.View>
  );
};
