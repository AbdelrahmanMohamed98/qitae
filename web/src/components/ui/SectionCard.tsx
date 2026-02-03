import type { SectionCardProps, SectionItemProps } from '../../types/SectionCard.types';

export function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <section className={`section-card ${className}`.trim()}>
      <h2 className="section-header">{title}</h2>
      {children}
    </section>
  );
}

export function SectionItem({ children, className = '' }: SectionItemProps) {
  return <div className={`section-item ${className}`.trim()}>{children}</div>;
}
