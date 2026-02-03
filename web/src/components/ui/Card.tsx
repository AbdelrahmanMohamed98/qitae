import type { CardProps, CardSmProps } from '../../types/Card.types';

export function Card({ children, className = '' }: CardProps) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <header className={`card-header ${className}`.trim()}>{children}</header>;
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={`card-body ${className}`.trim()}>{children}</div>;
}

export function CardSm({ children, className = '', as: Tag = 'div', href }: CardSmProps) {
  if (Tag === 'a' && href) {
    return (
      <a href={href} className={`block card-sm ${className}`.trim()}>
        {children}
      </a>
    );
  }
  return <Tag className={`block card-sm ${className}`.trim()}>{children}</Tag>;
}
