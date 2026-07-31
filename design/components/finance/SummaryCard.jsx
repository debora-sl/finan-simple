import React from 'react';

/**
 * SummaryCard — the metric cards at the top of the dashboard
 * (Saldo atual, Receitas do mês, Despesas do mês, Economia).
 */
export function SummaryCard({
  label,
  value,
  tone = 'neutral',
  icon = null,
  delta = null,
  deltaDirection = 'up',
  style = {},
  ...rest
}) {
  const tones = {
    neutral:  { fg: 'var(--text-primary)', iconBg: 'var(--bg-subtle)', iconFg: 'var(--text-secondary)' },
    positive: { fg: 'var(--positive-fg)', iconBg: 'var(--positive-soft)', iconFg: 'var(--positive)' },
    negative: { fg: 'var(--negative-fg)', iconBg: 'var(--negative-soft)', iconFg: 'var(--negative)' },
    action:   { fg: 'var(--text-primary)', iconBg: 'var(--action-soft)', iconFg: 'var(--action)' },
    warning:  { fg: 'var(--warning-fg)', iconBg: 'var(--warning-soft)', iconFg: 'var(--warning)' },
  };
  const t = tones[tone] || tones.neutral;
  const deltaPositive = deltaDirection === 'up';

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 14, padding: 'var(--space-5)',
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', minWidth: 0, ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        {icon && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 'var(--radius-md)', background: t.iconBg, color: t.iconFg, flexShrink: 0,
          }}>{icon}</span>
        )}
      </div>
      <div style={{
        fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', color: t.fg,
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
      }}>{value}</div>
      {delta != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600,
            color: deltaPositive ? 'var(--positive-fg)' : 'var(--negative-fg)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: deltaPositive ? 'none' : 'rotate(180deg)' }}>
              <path d="m18 15-6-6-6 6" />
            </svg>
            {delta}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>vs. mês anterior</span>
        </div>
      )}
    </div>
  );
}
