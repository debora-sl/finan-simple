import React from 'react';

const CAT_COLOR = {
  moradia: '#2563EB', mercado: '#16A34A', transporte: '#F59E0B', saude: '#EF4444',
  educacao: '#8B5CF6', lazer: '#EC4899', cartao: '#0EA5E9', fixas: '#14B8A6', outros: '#64748B',
};

/**
 * CategoryDonut — simple donut chart of expenses by category with a
 * centered total. `data` is [{category, value}] or [{color, value}].
 */
export function CategoryDonut({ data = [], total, totalLabel = 'Total', size = 180, thickness = 22, style = {}, ...rest }) {
  const sum = data.reduce((a, d) => a + (d.value || 0), 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = (d.value || 0) / sum;
    const len = frac * c;
    const seg = {
      color: d.color || CAT_COLOR[d.category] || CAT_COLOR.outros,
      dash: `${len} ${c - len}`,
      rot: (offset / c) * 360,
      key: i,
    };
    offset += len;
    return seg;
  });
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }} {...rest}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth={thickness} />
        {segs.map((s) => (
          <circle
            key={s.key} cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={s.color} strokeWidth={thickness} strokeDasharray={s.dash}
            strokeDashoffset={-(s.rot / 360) * c} strokeLinecap="butt"
          />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{totalLabel}</span>
        {total != null && <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{total}</span>}
      </div>
    </div>
  );
}
