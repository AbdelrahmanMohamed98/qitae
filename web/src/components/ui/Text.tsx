import type { TextVariant, TextProps } from '../../types/Text.types';

const variantStyles: Record<TextVariant, string> = {
  title1: 'text-3xl font-semibold text-slate-900 tracking-tight',
  title2: 'text-2xl font-semibold text-slate-900 tracking-tight',
  title3: 'text-lg font-semibold text-slate-900',
  body: 'text-base text-slate-700 leading-relaxed',
  bodySmall: 'text-sm text-slate-600 leading-relaxed',
  caption: 'text-sm text-slate-500',
  label: 'text-sm font-medium text-slate-700',
  error: 'text-sm text-red-600',
};

const variantTag: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  title1: 'h1',
  title2: 'h2',
  title3: 'h3',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
  label: 'span',
  error: 'p',
};

const VARIANT_KEYS: TextVariant[] = ['title1', 'title2', 'title3', 'body', 'bodySmall', 'caption', 'label', 'error'];

function getVariantFromProps(props: TextProps): TextVariant {
  if (props.variant) return props.variant;
  for (const key of VARIANT_KEYS) {
    if (props[key as keyof TextProps]) return key;
  }
  return 'body';
}

export default function Text(props: TextProps) {
  const {
    as,
    className = '',
    children,
    variant: _variant,
    title1: _t1,
    title2: _t2,
    title3: _t3,
    body: _b,
    bodySmall: _bs,
    caption: _c,
    label: _l,
    error: _e,
  } = props;
  const resolvedVariant = getVariantFromProps(props);
  const Tag = as ?? variantTag[resolvedVariant];
  const styles = variantStyles[resolvedVariant];

  return <Tag className={`${styles} ${className}`.trim()}>{children}</Tag>;
}
