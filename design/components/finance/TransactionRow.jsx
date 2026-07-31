import React from 'react';
import { CategoryIcon } from './CategoryIcon.jsx';

/**
 * TransactionRow — one line in "Últimas movimentações". Shows category
 * icon, description, date, and a signed amount (green income / red expense).
 */
export function TransactionRow({
  category = 'outros',
  description,
  meta,
  amount,
  type = 'expense',
  divider = true,
  style = {},
  ...rest
}) {
  const income = type === 'income';
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 4px',
        borderBottom: divider ? '1px solid var(--border-subtle)' : 'none', ...style,
      }}
      {...rest}
    >
      <CategoryIcon category={category} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description}
        </div>
        {meta && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{meta}</div>}
      </div>
      <div style={{
        fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
        color: income ? 'var(--positive-fg)' : 'var(--text-primary)',
      }}>
        {income ? '+' : '−'} {amount}
      </div>
    </div>
  );
}
