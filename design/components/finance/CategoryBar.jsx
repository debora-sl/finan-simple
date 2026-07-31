import React from 'react';
import { CategoryIcon } from './CategoryIcon.jsx';

const CAT_COLOR = {
  moradia: 'var(--cat-moradia)', mercado: 'var(--cat-mercado)', transporte: 'var(--cat-transporte)',
  saude: 'var(--cat-saude)', educacao: 'var(--cat-educacao)', lazer: 'var(--cat-lazer)',
  cartao: 'var(--cat-cartao)', fixas: 'var(--cat-fixas)', outros: 'var(--cat-outros)',
};

/**
 * CategoryBar — one row of the "Despesas por categoria" chart:
 * category icon + label, a proportional bar, amount and %.
 */
export function CategoryBar({ category = 'outros', label, amount, percent = 0, showIcon = true, style = {}, ...rest }) {
  const color = CAT_COLOR[category] || CAT_COLOR.outros;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }} {...rest}>
      {showIcon && <CategoryIcon category={category} size={36} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 7 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{amount}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 8, background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, percent)}%`, height: '100%', background: color, borderRadius: 'var(--radius-full)', transition: 'width var(--dur-slow) var(--ease-out)' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', width: 34, textAlign: 'right' }}>{Math.round(percent)}%</span>
        </div>
      </div>
    </div>
  );
}
