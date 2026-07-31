import React from 'react';
import { CategoryIcon } from './CategoryIcon.jsx';
import { Badge } from '../core/Badge.jsx';

/**
 * BillItem — one "Conta a pagar". Status drives the badge tone:
 * paga (positive), vence em breve (warning), atrasada (negative).
 */
export function BillItem({
  category = 'fixas',
  name,
  dueLabel,
  amount,
  status = 'pending',
  onPay,
  style = {},
  ...rest
}) {
  const statusMap = {
    paid:    { tone: 'positive', text: 'Pago' },
    duesoon: { tone: 'warning',  text: dueLabel || 'Vence em breve' },
    overdue: { tone: 'negative', text: dueLabel || 'Atrasado' },
    pending: { tone: 'neutral',  text: dueLabel || 'A vencer' },
  };
  const s = statusMap[status] || statusMap.pending;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
        background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', ...style,
      }}
      {...rest}
    >
      <CategoryIcon category={category} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ marginTop: 5 }}>
          <Badge tone={s.tone} size="sm" dot={status !== 'paid'}>{s.text}</Badge>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{amount}</span>
        {status !== 'paid' && onPay && (
          <button
            onClick={onPay}
            style={{
              border: 'none', background: 'transparent', color: 'var(--action)',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0,
            }}
          >Marcar como pago</button>
        )}
      </div>
    </div>
  );
}
