import type { InputProps, TextareaProps, SelectProps } from '../../types/Input.types';

const inputBaseClass = 'input';

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`${inputBaseClass} ${className}`.trim()}
      {...props}
    />
  );
}

const textareaBaseClass = 'input resize-y min-h-[theme(spacing.24)]';

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`${textareaBaseClass} ${className}`.trim()}
      {...props}
    />
  );
}

export function Select({
  className = '',
  options,
  placeholder,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={`select w-full ${className}`.trim()}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {children ?? options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
