import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@rn-primitives/progress';
import * as React from 'react';

function Progress({
  className,
  indicatorClassName,
  value = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
}) {
  // The primitive's Indicator does not read Root's value, so the fill width is
  // derived here once instead of at every call site. Clamped because budgets can
  // be overspent, and Root would otherwise report aria-valuenow=0.
  const pct = Math.min(Math.max(((value ?? 0) / max) * 100, 0), 100);

  return (
    <ProgressPrimitive.Root
      className={cn(
        'h-2 w-full bg-muted rounded-full overflow-hidden',
        className
      )}
      value={value}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full bg-primary rounded-full', indicatorClassName)}
        style={{ width: `${pct}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
