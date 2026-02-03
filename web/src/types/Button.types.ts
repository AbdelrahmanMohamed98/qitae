import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'amber' | 'emerald' | 'ghost';

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

export interface ButtonLinkProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  to: string;
}
