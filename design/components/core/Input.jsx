import React from 'react';

/**
 * Input — labeled text field with optional prefix/suffix (e.g. "R$").
 */
export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  id,
  style = {},
  ...rest
}) {
  const fieldId = id || (label ? `inp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? 'var(--negative)' : focus ? 'var(--border-focus)' : 'var(--border-strong)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <label htmlFor={fieldId} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 12px',
          background: 'var(--surface-card)', border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)', transition: 'border-color var(--dur-fast)',
          boxShadow: focus ? (error ? 'var(--ring-negative)' : 'var(--ring-action)') : 'none',
        }}
      >
        {prefix && <span style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500, flexShrink: 0 }}>{prefix}</span>}
        <input
          id={fieldId}
          onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-primary)',
            ...style,
          }}
          {...rest}
        />
        {suffix && <span style={{ color: 'var(--text-tertiary)', fontSize: 14, flexShrink: 0 }}>{suffix}</span>}
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 13, color: error ? 'var(--negative-fg)' : 'var(--text-secondary)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
