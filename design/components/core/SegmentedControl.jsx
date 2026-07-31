import React from 'react';

/**
 * SegmentedControl — inline single-select for short option sets
 * (period toggles: Mês / Semana / Ano; tabs).
 */
export function SegmentedControl({ options = [], value, onChange, size = 'md', style = {}, ...rest }) {
  const h = size === 'sm' ? 34 : 40;
  const fs = size === 'sm' ? 13 : 14;
  return (
    <div
      style={{
        display: 'inline-flex', padding: 3, gap: 2, background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', ...style,
      }}
      {...rest}
    >
      {options.map((o) => {
        const val = o.value ?? o;
        const lbl = o.label ?? o;
        const active = val === value;
        return (
          <button
            key={val}
            onClick={() => onChange && onChange(val)}
            style={{
              height: h, padding: '0 14px', border: 'none', borderRadius: 'var(--radius-sm)',
              background: active ? 'var(--surface-card)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 600, cursor: 'pointer',
              transition: 'all var(--dur-fast) var(--ease-out)', whiteSpace: 'nowrap',
            }}
          >
            {lbl}
          </button>
        );
      })}
    </div>
  );
}
