import { Link } from 'react-router-dom';
import type { ButtonVariant, ButtonProps, ButtonLinkProps } from '../../types/Button.types';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  amber: 'btn btn-amber',
  emerald: 'btn btn-emerald',
  ghost: 'btn btn-ghost',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const classes = `${variantClasses[variant]} ${className}`.trim();
  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = 'primary', className = '', children, to }: ButtonLinkProps) {
  const classes = `${variantClasses[variant]} ${className}`.trim();
  return <Link to={to} className={classes}>{children}</Link>;
}
