import * as React from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.ComponentProps<'input'> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, id, value, defaultValue, ...props }, ref) => {
    const inputId = id || React.useId();
    const [hasValue, setHasValue] = React.useState(
      Boolean(value !== undefined ? value : defaultValue)
    );

    React.useEffect(() => {
      setHasValue(Boolean(value));
    }, [value]);

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            'peer flex h-10 w-full rounded-md border border-input bg-background px-3 pt-4 pb-1 text-sm ring-offset-background',
            'placeholder-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          placeholder={label}
          onChange={(e) => {
            setHasValue(Boolean(e.target.value));
            props.onChange?.(e);
          }}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none',
            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
            'peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-primary',
            hasValue ? 'top-1.5 translate-y-0 text-[10px] text-primary' : 'top-1/2 -translate-y-1/2 text-sm'
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
