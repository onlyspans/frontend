import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ButtonGroup } from '@/shared/ui/button-group';
import { Input } from '@/shared/ui/input';

interface InputStepperProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  name?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  min: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
}

export function InputStepper({
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  min,
  max,
  step = 1,
  disabled,
  className,
  decrementAriaLabel = 'decrease value',
  incrementAriaLabel = 'increase value'
}: InputStepperProps) {
  const decDisabled = disabled || value <= min;
  const incDisabled = disabled || (typeof max === 'number' ? value >= max : false);

  const clamp = (next: number) => {
    if (Number.isNaN(next)) return next;
    if (typeof max === 'number') return Math.min(max, Math.max(min, next));
    return Math.max(min, next);
  };

  const onInputChange = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/[^\d]/g, '');
    if (!digitsOnly) {
      onChange(min);
      return;
    }
    onChange(clamp(Number(digitsOnly)));
  };

  return (
    <ButtonGroup className={className ?? 'w-full'}>
      <Button
        type="button"
        variant="outline"
        aria-label={decrementAriaLabel}
        disabled={decDisabled}
        onClick={() => onChange(clamp(value - step))}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={String(value)}
        onChange={(e) => onInputChange(e.currentTarget.value)}
        onBlur={onBlur}
        name={name}
        ref={inputRef}
        disabled={disabled}
        className="text-center"
      />
      <Button
        type="button"
        variant="outline"
        aria-label={incrementAriaLabel}
        disabled={incDisabled}
        onClick={() => onChange(clamp(value + step))}
      >
        <Plus className="size-4" />
      </Button>
    </ButtonGroup>
  );
}

