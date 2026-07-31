import React from 'react';

/**
 * Badge — compact status/category pill. Tones map to semantic colors.
 */
export function Badge({ tone = 'neutral', size = 'md', dot = false, children, style = {}, ...rest }) {
  const tones = {
    neutral:  { bg: 'var(--bg-subtle)', fg: 'var(--text-secondary)' },
    action:   { bg: 'var(--action-soft)', fg: 'var(--action-soft-fg)' },
    positive: { bg: 'var(--positive-soft)', fg: 'var(--positive-fg)' },
    negative: { bg: 'var(--negative-soft)', fg: 'var(--negative-fg)' },
    warning:  { bg: 'var(--warning-soft)', fg: 'var(--warning-fg)' },
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '2px 8px' : '4px 10px';
  const fs = size === 'sm' ? 12 : 13;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad,
        background: t.bg, color: t.fg, borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 600,
        lineHeight: 1.2, whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.fg, flexShrink: 0 }} />}
      {children}
    </span>
  );
}
