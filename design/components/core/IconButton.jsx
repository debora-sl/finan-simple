import React from 'react';

/**
 * IconButton — square button for a single icon (toolbar, card actions).
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  label,
  children,
  style = {},
  ...rest
}) {
  const dims = { sm: 32, md: 40, lg: 44 }[size] || 40;
  const variants = {
    ghost:     { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
    secondary: { background: 'var(--surface-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' },
    soft:      { background: 'var(--action-soft)', color: 'var(--action-soft-fg)', border: '1px solid transparent' },
  };
  const v = variants[variant] || variants.ghost;
  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: dims, height: dims, borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-fast) var(--ease-out), filter var(--dur-fast)',
        ...v, ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && variant === 'ghost') e.currentTarget.style.background = 'var(--surface-hover)'; }}
      onMouseLeave={(e) => { if (variant === 'ghost') e.currentTarget.style.background = 'transparent'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
