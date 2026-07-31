import React from 'react';

/**
 * ProgressBar — horizontal meter for goals/budgets. Tone drives fill color.
 */
export function ProgressBar({ value = 0, max = 100, tone = 'action', height = 8, showLabel = false, style = {}, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fills = {
    action: 'var(--action)', positive: 'var(--positive)',
    warning: 'var(--warning)', negative: 'var(--negative)',
  };
  return (
    <div style={{ width: '100%', ...style }} {...rest}>
      <div style={{ width: '100%', height, background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: fills[tone] || fills.action,
          borderRadius: 'var(--radius-full)', transition: 'width var(--dur-slow) var(--ease-out)',
        }} />
      </div>
      {showLabel && (
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
