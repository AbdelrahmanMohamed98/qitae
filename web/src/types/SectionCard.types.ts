import type { ReactNode } from 'react';

export interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export interface SectionItemProps {
  children: ReactNode;
  className?: string;
}
