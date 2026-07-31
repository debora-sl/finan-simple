import React from 'react';

/**
 * Switch — on/off toggle (e.g. dark mode, recurring expense).
 */
export function Switch({ checked = false, onChange, disabled = false, label, style = {}, ...rest }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          position: 'relative', width: 44, height: 26, borderRadius: 'var(--radius-full)',
          background: checked ? 'var(--action)' : 'var(--border-strong)',
          transition: 'background var(--dur-base) var(--ease-out)', flexShrink: 0,
        }}
        {...rest}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3, width: 20, height: 20,
          borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)',
          transition: 'left var(--dur-base) var(--ease-out)',
        }} />
      </span>
      {label && <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>}
    </label>
  );
}
