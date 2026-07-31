import React from 'react';

/**
 * Button — primary action control for Controle Financeiro.
 * Variants: primary (blue), secondary (outline), ghost, positive, negative.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 14, padding: '8px 12px', height: 36, gap: 6, radius: 'var(--radius-sm)' },
    md: { fontSize: 15, padding: '10px 16px', height: 44, gap: 8, radius: 'var(--radius-md)' },
    lg: { fontSize: 16, padding: '13px 22px', height: 52, gap: 8, radius: 'var(--radius-md)' },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary:   { background: 'var(--action)', color: 'var(--text-on-accent)', border: '1px solid transparent', boxShadow: 'var(--shadow-xs)' },
    secondary: { background: 'var(--surface-card)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-xs)' },
    ghost:     { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
    positive:  { background: 'var(--positive)', color: '#fff', border: '1px solid transparent', boxShadow: 'var(--shadow-xs)' },
    negative:  { background: 'var(--negative)', color: '#fff', border: '1px solid transparent', boxShadow: 'var(--shadow-xs)' },
  };
  const v = variants[variant] || variants.primary;

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap, height: s.height, padding: s.padding, borderRadius: s.radius,
        fontFamily: 'var(--font-sans)', fontSize: s.fontSize, fontWeight: 600,
        lineHeight: 1, letterSpacing: '-0.01em', cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto', whiteSpace: 'nowrap',
        transition: 'filter var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        opacity: disabled ? 0.5 : 1, ...v, ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
      onMouseEnter={(e) => { if (!disabled && variant !== 'ghost') e.currentTarget.style.filter = 'brightness(0.94)'; if (!disabled && variant === 'ghost') e.currentTarget.style.background = 'var(--surface-hover)'; }}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{iconRight}</span>}
    </button>
  );
}
