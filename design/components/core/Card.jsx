import React from 'react';

/**
 * Card — base surface container. The building block of the dashboard.
 */
export function Card({ padding = 'md', interactive = false, children, style = {}, ...rest }) {
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-6)' };
  return (
    <div
      style={{
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
        padding: pads[padding] ?? pads.md,
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default', ...style,
      }}
      onMouseEnter={(e) => { if (interactive) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
      onMouseLeave={(e) => { if (interactive) { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
      {...rest}
    >
      {children}
    </div>
  );
}
