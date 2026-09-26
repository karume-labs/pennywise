import { cn } from '@/lib/utils';
import * as SwitchPrimitive from '@rn-primitives/switch';
import * as React from 'react';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'w-14 h-8 rounded-full border border-border justify-start',
        props.checked && 'bg-primary',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'size-6 rounded-full bg-foreground',
          props.checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
