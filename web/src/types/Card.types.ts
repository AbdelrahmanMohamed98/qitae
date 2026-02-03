import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardSmProps extends CardProps {
  as?: 'div' | 'a';
  href?: string;
}
