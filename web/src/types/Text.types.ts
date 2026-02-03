import type { ReactNode } from 'react';

export type TextVariant =
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'error';

export interface TextProps {
  variant?: TextVariant;
  /** Shorthand: use <Text title2>...</Text> instead of variant="title2" */
  title1?: boolean;
  title2?: boolean;
  title3?: boolean;
  body?: boolean;
  bodySmall?: boolean;
  caption?: boolean;
  label?: boolean;
  error?: boolean;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: ReactNode;
}
