import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  /** Value as 'YYYY-MM-DD' string */
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const d = parse(value, 'yyyy-MM-dd', new Date());
    return isValid(d) ? d : undefined;
  }, [value]);

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      onChange?.(format(day, 'yyyy-MM-dd'));
    } else {
      onChange?.('');
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-9 justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, 'MMM d, yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
        />
        {selected && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => handleSelect(undefined)}
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Calendar popover with year + month dropdowns in the header and a day grid below.
 * Ideal for expiry dates that are 5–15 years ahead.
 * Value and onChange use 'YYYY-MM-DD'.
 */
export function ExpiryDatePicker({ value, onChange, placeholder = 'Select expiry', className, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const d = parse(value, 'yyyy-MM-dd', new Date());
    return isValid(d) ? d : undefined;
  }, [value]);

  const handleSelect = (day: Date | undefined) => {
    onChange?.(day ? format(day, 'yyyy-MM-dd') : '');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('h-9 justify-start text-left font-normal', !selected && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {selected ? format(selected, 'MMM d, yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          captionLayout="dropdown"
          fromYear={currentYear}
          toYear={currentYear + 15}
          defaultMonth={selected ?? new Date(currentYear, 0)}
          initialFocus
          classNames={{
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'hidden',
            caption_dropdowns: 'flex gap-2',
            dropdown: cn(
              'rounded-md border border-input bg-background px-2 py-1 text-sm',
              'focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer',
            ),
          }}
        />
        {selected && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground"
              onClick={() => handleSelect(undefined)}>
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
