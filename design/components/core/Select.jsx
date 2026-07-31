import React from 'react';

/**
 * Select — labeled native dropdown styled to match Input.
 */
export function Select({ label, hint, options = [], id, style = {}, ...rest }) {
  const fieldId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <label htmlFor={fieldId} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={fieldId}
          style={{
            appearance: 'none', WebkitAppearance: 'none', width: '100%', height: 44,
            padding: '0 38px 0 12px', background: 'var(--surface-card)',
            border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-primary)',
            cursor: 'pointer', outline: 'none', ...style,
          }}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ position: 'absolute', right: 12, color: 'var(--text-secondary)', pointerEvents: 'none' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {hint && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{hint}</span>}
    </div>
  );
}
