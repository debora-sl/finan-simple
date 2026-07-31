/* @ds-bundle: {"format":3,"namespace":"ControleFinanceiroDesignSystem_2e2cd7","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"SegmentedControl","sourcePath":"components/core/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"BillItem","sourcePath":"components/finance/BillItem.jsx"},{"name":"CategoryBar","sourcePath":"components/finance/CategoryBar.jsx"},{"name":"CategoryDonut","sourcePath":"components/finance/CategoryDonut.jsx"},{"name":"CategoryIcon","sourcePath":"components/finance/CategoryIcon.jsx"},{"name":"SummaryCard","sourcePath":"components/finance/SummaryCard.jsx"},{"name":"TransactionRow","sourcePath":"components/finance/TransactionRow.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"80cde60eb8f9","components/core/Button.jsx":"eb9763e03821","components/core/Card.jsx":"8645a28bcbf0","components/core/IconButton.jsx":"86da4cbeeaea","components/core/Input.jsx":"2eed22e8feba","components/core/ProgressBar.jsx":"2796cae63d27","components/core/SegmentedControl.jsx":"78d82d865f4d","components/core/Select.jsx":"139f2b1e7435","components/core/Switch.jsx":"676ccc14ce05","components/finance/BillItem.jsx":"95217c0509e5","components/finance/CategoryBar.jsx":"6662dbab133d","components/finance/CategoryDonut.jsx":"0443c80a83d5","components/finance/CategoryIcon.jsx":"1426156d3b5f","components/finance/SummaryCard.jsx":"3611ccbed22e","components/finance/TransactionRow.jsx":"d597aaa84fd8","ui_kits/dashboard/AddTransactionModal.jsx":"0518be28873c","ui_kits/dashboard/DashboardScreen.jsx":"48185e2d4ba0","ui_kits/dashboard/Sidebar.jsx":"3c706a072def","ui_kits/dashboard/Topbar.jsx":"c0743e5d0f18","ui_kits/dashboard/data.js":"dbb53c42f9a4","ui_kits/icons.js":"d7aaca91da55","ui_kits/marketing/Landing.jsx":"b3d82c8ca025","ui_kits/mobile/MobileApp.jsx":"8a3f6cefe78c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ControleFinanceiroDesignSystem_2e2cd7 = window.ControleFinanceiroDesignSystem_2e2cd7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — compact status/category pill. Tones map to semantic colors.
 */
function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  children,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: 'var(--bg-subtle)',
      fg: 'var(--text-secondary)'
    },
    action: {
      bg: 'var(--action-soft)',
      fg: 'var(--action-soft-fg)'
    },
    positive: {
      bg: 'var(--positive-soft)',
      fg: 'var(--positive-fg)'
    },
    negative: {
      bg: 'var(--negative-soft)',
      fg: 'var(--negative-fg)'
    },
    warning: {
      bg: 'var(--warning-soft)',
      fg: 'var(--warning-fg)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '2px 8px' : '4px 10px';
  const fs = size === 'sm' ? 12 : 13;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      background: t.bg,
      color: t.fg,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 600,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.fg,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary action control for Controle Financeiro.
 * Variants: primary (blue), secondary (outline), ghost, positive, negative.
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: 14,
      padding: '8px 12px',
      height: 36,
      gap: 6,
      radius: 'var(--radius-sm)'
    },
    md: {
      fontSize: 15,
      padding: '10px 16px',
      height: 44,
      gap: 8,
      radius: 'var(--radius-md)'
    },
    lg: {
      fontSize: 16,
      padding: '13px 22px',
      height: 52,
      gap: 8,
      radius: 'var(--radius-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--action)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-xs)'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-xs)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    positive: {
      background: 'var(--positive)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-xs)'
    },
    negative: {
      background: 'var(--negative)',
      color: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-xs)'
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      borderRadius: s.radius,
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '-0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      transition: 'filter var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 0.5 : 1,
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.filter = 'none';
    },
    onMouseEnter: e => {
      if (!disabled && variant !== 'ghost') e.currentTarget.style.filter = 'brightness(0.94)';
      if (!disabled && variant === 'ghost') e.currentTarget.style.background = 'var(--surface-hover)';
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — base surface container. The building block of the dashboard.
 */
function Card({
  padding = 'md',
  interactive = false,
  children,
  style = {},
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: pads[padding] ?? pads.md,
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    },
    onMouseEnter: e => {
      if (interactive) {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }
    },
    onMouseLeave: e => {
      if (interactive) {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square button for a single icon (toolbar, card actions).
 */
function IconButton({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  label,
  children,
  style = {},
  ...rest
}) {
  const dims = {
    sm: 32,
    md: 40,
    lg: 44
  }[size] || 40;
  const variants = {
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-xs)'
    },
    soft: {
      background: 'var(--action-soft)',
      color: 'var(--action-soft-fg)',
      border: '1px solid transparent'
    }
  };
  const v = variants[variant] || variants.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dims,
      height: dims,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast) var(--ease-out), filter var(--dur-fast)',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (!disabled && variant === 'ghost') e.currentTarget.style.background = 'var(--surface-hover)';
    },
    onMouseLeave: e => {
      if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — labeled text field with optional prefix/suffix (e.g. "R$").
 */
function Input({
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 44,
      padding: '0 12px',
      background: 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      transition: 'border-color var(--dur-fast)',
      boxShadow: focus ? error ? 'var(--ring-negative)' : 'var(--ring-action)' : 'none'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 15,
      fontWeight: 500,
      flexShrink: 0
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-primary)',
      ...style
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontSize: 14,
      flexShrink: 0
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: error ? 'var(--negative-fg)' : 'var(--text-secondary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — horizontal meter for goals/budgets. Tone drives fill color.
 */
function ProgressBar({
  value = 0,
  max = 100,
  tone = 'action',
  height = 8,
  showLabel = false,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fills = {
    action: 'var(--action)',
    positive: 'var(--positive)',
    warning: 'var(--warning)',
    negative: 'var(--negative)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: '100%',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height,
      background: 'var(--bg-subtle)',
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      background: fills[tone] || fills.action,
      borderRadius: 'var(--radius-full)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })), showLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 13,
      color: 'var(--text-secondary)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, Math.round(pct), "%"));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SegmentedControl — inline single-select for short option sets
 * (period toggles: Mês / Semana / Ano; tabs).
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  size = 'md',
  style = {},
  ...rest
}) {
  const h = size === 'sm' ? 34 : 40;
  const fs = size === 'sm' ? 13 : 14;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, rest), options.map(o => {
    const val = o.value ?? o;
    const lbl = o.label ?? o;
    const active = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: () => onChange && onChange(val),
      style: {
        height: h,
        padding: '0 14px',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--surface-card)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        boxShadow: active ? 'var(--shadow-xs)' : 'none',
        fontFamily: 'var(--font-sans)',
        fontSize: fs,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap'
      }
    }, lbl);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — labeled native dropdown styled to match Input.
 */
function Select({
  label,
  hint,
  options = [],
  id,
  style = {},
  ...rest
}) {
  const fieldId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 44,
      padding: '0 38px 0 12px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-primary)',
      cursor: 'pointer',
      outline: 'none',
      ...style
    }
  }, rest), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    style: {
      position: 'absolute',
      right: 12,
      color: 'var(--text-secondary)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Switch — on/off toggle (e.g. dark mode, recurring expense).
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    role: "switch",
    "aria-checked": checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: 44,
      height: 26,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--action)' : 'var(--border-strong)',
      transition: 'background var(--dur-base) var(--ease-out)',
      flexShrink: 0
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-primary)',
      fontWeight: 500
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/finance/CategoryDonut.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CAT_COLOR = {
  moradia: '#2563EB',
  mercado: '#16A34A',
  transporte: '#F59E0B',
  saude: '#EF4444',
  educacao: '#8B5CF6',
  lazer: '#EC4899',
  cartao: '#0EA5E9',
  fixas: '#14B8A6',
  outros: '#64748B'
};

/**
 * CategoryDonut — simple donut chart of expenses by category with a
 * centered total. `data` is [{category, value}] or [{color, value}].
 */
function CategoryDonut({
  data = [],
  total,
  totalLabel = 'Total',
  size = 180,
  thickness = 22,
  style = {},
  ...rest
}) {
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
      rot: offset / c * 360,
      key: i
    };
    offset += len;
    return seg;
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width: size,
      height: size,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--bg-subtle)",
    strokeWidth: thickness
  }), segs.map(s => /*#__PURE__*/React.createElement("circle", {
    key: s.key,
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: s.color,
    strokeWidth: thickness,
    strokeDasharray: s.dash,
    strokeDashoffset: -(s.rot / 360) * c,
    strokeLinecap: "butt"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-secondary)'
    }
  }, totalLabel), total != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em'
    }
  }, total)));
}
Object.assign(__ds_scope, { CategoryDonut });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/finance/CategoryDonut.jsx", error: String((e && e.message) || e) }); }

// components/finance/CategoryIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CategoryIcon — colored rounded chip with the glyph for a household
 * expense category. Single source of truth for category color + icon.
 */
const CATEGORIES = {
  moradia: {
    color: 'var(--cat-moradia)',
    label: 'Moradia',
    path: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z'
  },
  mercado: {
    color: 'var(--cat-mercado)',
    label: 'Mercado',
    path: 'M2.5 3h2l2.4 12.3a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
  },
  transporte: {
    color: 'var(--cat-transporte)',
    label: 'Transporte',
    path: 'M5 17H3v-5l2-5h10l3 5h1a2 2 0 0 1 2 2v3h-2m-4 0H9m-4 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z'
  },
  saude: {
    color: 'var(--cat-saude)',
    label: 'Saúde',
    path: 'M3 12h3l2-5 4 10 2-5h5'
  },
  educacao: {
    color: 'var(--cat-educacao)',
    label: 'Educação',
    path: 'M12 4 2 9l10 5 10-5-10-5ZM6 11.5V16c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5'
  },
  lazer: {
    color: 'var(--cat-lazer)',
    label: 'Lazer',
    path: 'M6 11h4M8 9v4m6-2h.01M17 13h.01M17.3 5H6.7A4.7 4.7 0 0 0 2 9.7c0 .8.1 1.6.4 2.4l1.6 5A2.5 2.5 0 0 0 8.4 18l.9-1.4a1.5 1.5 0 0 1 1.3-.7h2.8a1.5 1.5 0 0 1 1.3.7l.9 1.4a2.5 2.5 0 0 0 4.4-.9l1.6-5c.3-.8.4-1.6.4-2.4A4.7 4.7 0 0 0 17.3 5Z'
  },
  cartao: {
    color: 'var(--cat-cartao)',
    label: 'Cartão de crédito',
    path: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm0 4h20'
  },
  fixas: {
    color: 'var(--cat-fixas)',
    label: 'Contas fixas',
    path: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3Zm3 5h8M8 12h8'
  },
  outros: {
    color: 'var(--cat-outros)',
    label: 'Outros',
    path: 'M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
  }
};
function CategoryIcon({
  category = 'outros',
  size = 40,
  style = {},
  ...rest
}) {
  const c = CATEGORIES[category] || CATEGORIES.outros;
  const icon = Math.round(size * 0.52);
  return /*#__PURE__*/React.createElement("span", _extends({
    title: c.label,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: `color-mix(in srgb, ${c.color} 14%, transparent)`,
      color: c.color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: icon,
    height: icon,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: c.path
  })));
}
CategoryIcon.categories = CATEGORIES;
Object.assign(__ds_scope, { CategoryIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/finance/CategoryIcon.jsx", error: String((e && e.message) || e) }); }

// components/finance/BillItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BillItem — one "Conta a pagar". Status drives the badge tone:
 * paga (positive), vence em breve (warning), atrasada (negative).
 */
function BillItem({
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
    paid: {
      tone: 'positive',
      text: 'Pago'
    },
    duesoon: {
      tone: 'warning',
      text: dueLabel || 'Vence em breve'
    },
    overdue: {
      tone: 'negative',
      text: dueLabel || 'Atrasado'
    },
    pending: {
      tone: 'neutral',
      text: dueLabel || 'A vencer'
    }
  };
  const s = statusMap[status] || statusMap.pending;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.CategoryIcon, {
    category: category,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: s.tone,
    size: "sm",
    dot: status !== 'paid'
  }, s.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-primary)'
    }
  }, amount), status !== 'paid' && onPay && /*#__PURE__*/React.createElement("button", {
    onClick: onPay,
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--action)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      padding: 0
    }
  }, "Marcar como pago")));
}
Object.assign(__ds_scope, { BillItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/finance/BillItem.jsx", error: String((e && e.message) || e) }); }

// components/finance/CategoryBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CAT_COLOR = {
  moradia: 'var(--cat-moradia)',
  mercado: 'var(--cat-mercado)',
  transporte: 'var(--cat-transporte)',
  saude: 'var(--cat-saude)',
  educacao: 'var(--cat-educacao)',
  lazer: 'var(--cat-lazer)',
  cartao: 'var(--cat-cartao)',
  fixas: 'var(--cat-fixas)',
  outros: 'var(--cat-outros)'
};

/**
 * CategoryBar — one row of the "Despesas por categoria" chart:
 * category icon + label, a proportional bar, amount and %.
 */
function CategoryBar({
  category = 'outros',
  label,
  amount,
  percent = 0,
  showIcon = true,
  style = {},
  ...rest
}) {
  const color = CAT_COLOR[category] || CAT_COLOR.outros;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, rest), showIcon && /*#__PURE__*/React.createElement(__ds_scope.CategoryIcon, {
    category: category,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap'
    }
  }, amount)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      background: 'var(--bg-subtle)',
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.min(100, percent)}%`,
      height: '100%',
      background: color,
      borderRadius: 'var(--radius-full)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-secondary)',
      fontVariantNumeric: 'tabular-nums',
      width: 34,
      textAlign: 'right'
    }
  }, Math.round(percent), "%"))));
}
Object.assign(__ds_scope, { CategoryBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/finance/CategoryBar.jsx", error: String((e && e.message) || e) }); }

// components/finance/SummaryCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SummaryCard — the metric cards at the top of the dashboard
 * (Saldo atual, Receitas do mês, Despesas do mês, Economia).
 */
function SummaryCard({
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
    neutral: {
      fg: 'var(--text-primary)',
      iconBg: 'var(--bg-subtle)',
      iconFg: 'var(--text-secondary)'
    },
    positive: {
      fg: 'var(--positive-fg)',
      iconBg: 'var(--positive-soft)',
      iconFg: 'var(--positive)'
    },
    negative: {
      fg: 'var(--negative-fg)',
      iconBg: 'var(--negative-soft)',
      iconFg: 'var(--negative)'
    },
    action: {
      fg: 'var(--text-primary)',
      iconBg: 'var(--action-soft)',
      iconFg: 'var(--action)'
    },
    warning: {
      fg: 'var(--warning-fg)',
      iconBg: 'var(--warning-soft)',
      iconFg: 'var(--warning)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const deltaPositive = deltaDirection === 'up';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      minWidth: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-secondary)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: t.iconBg,
      color: t.iconFg,
      flexShrink: 0
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: t.fg,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1.1
    }
  }, value), delta != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontWeight: 600,
      color: deltaPositive ? 'var(--positive-fg)' : 'var(--negative-fg)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    style: {
      transform: deltaPositive ? 'none' : 'rotate(180deg)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m18 15-6-6-6 6"
  })), delta), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, "vs. m\xEAs anterior")));
}
Object.assign(__ds_scope, { SummaryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/finance/SummaryCard.jsx", error: String((e && e.message) || e) }); }

// components/finance/TransactionRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TransactionRow — one line in "Últimas movimentações". Shows category
 * icon, description, date, and a signed amount (green income / red expense).
 */
function TransactionRow({
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
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 4px',
      borderBottom: divider ? '1px solid var(--border-subtle)' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.CategoryIcon, {
    category: category,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, description), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, meta)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      color: income ? 'var(--positive-fg)' : 'var(--text-primary)'
    }
  }, income ? '+' : '−', " ", amount));
}
Object.assign(__ds_scope, { TransactionRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/finance/TransactionRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/AddTransactionModal.jsx
try { (() => {
// AddTransactionModal — dialog to add a receita or despesa.
function AddTransactionModal({
  open,
  onClose,
  onSave
}) {
  const I = window.CFIcon;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const {
    Button,
    Input,
    Select,
    SegmentedControl
  } = DS;
  const [type, setType] = React.useState('expense');
  const [amount, setAmount] = React.useState('');
  const [desc, setDesc] = React.useState('');
  if (!open) return null;
  const isIncome = type === 'income';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15,23,42,0.45)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(460px, 100%)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, "Nova transa\xE7\xE3o"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(I.x, {
    size: 22
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    value: type,
    onChange: setType,
    style: {
      width: '100%'
    },
    options: [{
      value: 'expense',
      label: 'Despesa'
    }, {
      value: 'income',
      label: 'Receita'
    }]
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Valor",
    prefix: "R$",
    placeholder: "0,00",
    inputMode: "decimal",
    value: amount,
    onChange: e => setAmount(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Descri\xE7\xE3o",
    placeholder: isIncome ? 'Ex: Salário' : 'Ex: Mercado da semana',
    value: desc,
    onChange: e => setDesc(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Categoria",
    options: ['Moradia', 'Mercado', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Cartão de crédito', 'Contas fixas', 'Outros']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Data",
    options: ['Hoje · 18 jun', 'Ontem · 17 jun', 'Escolher outra data…']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '0 24px 24px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onClose
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: isIncome ? 'positive' : 'primary',
    fullWidth: true,
    onClick: () => onSave && onSave({
      type,
      amount,
      desc
    })
  }, "Salvar ", isIncome ? 'receita' : 'despesa'))));
}
window.AddTransactionModal = AddTransactionModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/AddTransactionModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashboardScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DashboardScreen — the "Visão geral" view composing summary cards,
// bills, transactions, the category chart and a savings goal.
function DashboardScreen({
  onAdd,
  category
}) {
  const I = window.CFIcon;
  const D = window.CF_DATA;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const {
    SummaryCard,
    BillItem,
    TransactionRow,
    CategoryBar,
    CategoryDonut,
    Card,
    ProgressBar,
    Button,
    Badge
  } = DS;
  const [bills, setBills] = React.useState(D.bills);
  const pay = id => setBills(bs => bs.map(b => b.id === id ? {
    ...b,
    status: 'paid',
    dueLabel: 'Pago agora'
  } : b));
  const tx = category && category !== 'all' ? D.transactions.filter(t => t.category === category) : D.transactions;
  const goalPct = Math.round(D.goal.current / D.goal.target * 100);
  const Section = ({
    title,
    action,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, title), action), children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      maxWidth: 1160
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SummaryCard, {
    label: "Saldo atual",
    value: D.saldo,
    tone: "action",
    icon: /*#__PURE__*/React.createElement(I.wallet, {
      size: 20
    }),
    delta: "8%",
    deltaDirection: "up"
  }), /*#__PURE__*/React.createElement(SummaryCard, {
    label: "Receitas do m\xEAs",
    value: D.receitas,
    tone: "positive",
    icon: /*#__PURE__*/React.createElement(I.arrowDownLeft, {
      size: 20
    }),
    delta: "3%",
    deltaDirection: "up"
  }), /*#__PURE__*/React.createElement(SummaryCard, {
    label: "Despesas do m\xEAs",
    value: D.despesas,
    tone: "negative",
    icon: /*#__PURE__*/React.createElement(I.arrowUpRight, {
      size: 20
    }),
    delta: "5%",
    deltaDirection: "down"
  }), /*#__PURE__*/React.createElement(SummaryCard, {
    label: "Economia do m\xEAs",
    value: D.economia,
    tone: "positive",
    icon: /*#__PURE__*/React.createElement(I.piggy, {
      size: 20
    }),
    delta: "12%",
    deltaDirection: "up"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
      gap: 24,
      alignItems: 'start'
    },
    className: "cf-cols"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Despesas por categoria",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Junho")
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(CategoryDonut, {
    total: D.despesas.replace(',00', ''),
    totalLabel: "Despesas",
    size: 168,
    data: D.categories.map(c => ({
      category: c.category,
      value: c.value
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, D.categories.slice(0, 5).map(c => /*#__PURE__*/React.createElement(CategoryBar, _extends({
    key: c.category
  }, c))))))), /*#__PURE__*/React.createElement(Section, {
    title: "\xDAltimas movimenta\xE7\xF5es",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Ver todas")
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "sm"
  }, tx.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: 'center',
      color: 'var(--text-secondary)',
      fontSize: 14
    }
  }, "Nenhuma movimenta\xE7\xE3o nesta categoria."), tx.map((t, i) => /*#__PURE__*/React.createElement(TransactionRow, _extends({
    key: t.id
  }, t, {
    divider: i < tx.length - 1
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Contas a pagar",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "warning",
      dot: true
    }, "2 vencem em breve")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, bills.map(b => /*#__PURE__*/React.createElement(BillItem, _extends({
    key: b.id
  }, b, {
    onPay: () => pay(b.id)
  }))))), /*#__PURE__*/React.createElement(Section, {
    title: "Meta de economia"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-md)',
      background: 'var(--positive-soft)',
      color: 'var(--positive)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(I.target, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "Reserva de emerg\xEAncia"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, D.goal.currentLabel, " de ", D.goal.targetLabel))), /*#__PURE__*/React.createElement(ProgressBar, {
    value: D.goal.current,
    max: D.goal.target,
    tone: "positive",
    height: 10
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, goalPct, "% conclu\xEDdo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--positive-fg)'
    }
  }, "Faltam R$ 4.200")))))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Sidebar.jsx
try { (() => {
// Sidebar — primary navigation for the desktop dashboard.
function Sidebar({
  active = 'home',
  onNavigate,
  theme,
  onToggleTheme
}) {
  const I = window.CFIcon;
  const items = [{
    key: 'home',
    label: 'Visão geral',
    icon: I.home
  }, {
    key: 'transactions',
    label: 'Movimentações',
    icon: I.list
  }, {
    key: 'bills',
    label: 'Contas a pagar',
    icon: I.bills
  }, {
    key: 'reports',
    label: 'Relatórios',
    icon: I.chart
  }, {
    key: 'goals',
    label: 'Metas',
    icon: I.target
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flexShrink: 0,
      height: '100%',
      boxSizing: 'border-box',
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '4px 8px 22px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: 'var(--action)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(I.piggy, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, "Controle"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, "Financeiro"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1
    }
  }, items.map(it => {
    const on = active === it.key;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      onClick: () => onNavigate && onNavigate(it.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        background: on ? 'var(--action-soft)' : 'transparent',
        color: on ? 'var(--action-soft-fg)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        fontWeight: on ? 600 : 500,
        transition: 'background var(--dur-fast)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--surface-hover)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(it.icon, {
      size: 19
    }), " ", it.label);
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleTheme,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 12px',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: 'var(--bg-subtle)',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600
    }
  }, theme === 'dark' ? /*#__PURE__*/React.createElement(I.sun, {
    size: 18
  }) : /*#__PURE__*/React.createElement(I.moon, {
    size: 18
  }), theme === 'dark' ? 'Modo claro' : 'Modo escuro'));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Topbar.jsx
try { (() => {
// Topbar — page header with title, month/category filters, and add button.
function Topbar({
  title,
  subtitle,
  month,
  onMonth,
  category,
  onCategory,
  onAdd,
  onMenu
}) {
  const I = window.CFIcon;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const {
    Button,
    IconButton
  } = DS;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '18px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-app)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onMenu,
    className: "cf-menu-btn",
    style: {
      display: 'none',
      border: 'none',
      background: 'transparent',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(I.menu, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "cf-filters",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: month,
    onChange: e => onMonth && onMonth(e.target.value),
    style: selStyle
  }, window.CF_DATA.months.map((m, i) => /*#__PURE__*/React.createElement("option", {
    key: m,
    value: i
  }, m, " 2026"))), /*#__PURE__*/React.createElement("span", {
    style: selChevron
  }, /*#__PURE__*/React.createElement(I.chevronDown, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: category,
    onChange: e => onCategory && onCategory(e.target.value),
    style: selStyle
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Todas as categorias"), /*#__PURE__*/React.createElement("option", {
    value: "moradia"
  }, "Moradia"), /*#__PURE__*/React.createElement("option", {
    value: "mercado"
  }, "Mercado"), /*#__PURE__*/React.createElement("option", {
    value: "transporte"
  }, "Transporte"), /*#__PURE__*/React.createElement("option", {
    value: "cartao"
  }, "Cart\xE3o de cr\xE9dito"), /*#__PURE__*/React.createElement("option", {
    value: "lazer"
  }, "Lazer")), /*#__PURE__*/React.createElement("span", {
    style: selChevron
  }, /*#__PURE__*/React.createElement(I.chevronDown, {
    size: 16
  }))), /*#__PURE__*/React.createElement(IconButton, {
    label: "Notifica\xE7\xF5es",
    variant: "secondary"
  }, /*#__PURE__*/React.createElement(I.bell, {
    size: 18
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(I.plus, {
      size: 18
    }),
    onClick: onAdd
  }, "Adicionar")));
}
const selStyle = {
  appearance: 'none',
  WebkitAppearance: 'none',
  height: 44,
  padding: '0 36px 0 14px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-primary)',
  cursor: 'pointer',
  outline: 'none'
};
const selChevron = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-secondary)',
  pointerEvents: 'none',
  display: 'inline-flex'
};
window.Topbar = Topbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Topbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/data.js
try { (() => {
// Mock household-finance data for the Controle Financeiro UI kits.
window.CF_DATA = {
  saldo: 'R$ 4.280,00',
  receitas: 'R$ 7.400,00',
  despesas: 'R$ 3.120,00',
  economia: 'R$ 1.160,00',
  bills: [{
    id: 1,
    category: 'moradia',
    name: 'Aluguel',
    status: 'duesoon',
    dueLabel: 'Vence em 3 dias',
    amount: 'R$ 1.800,00'
  }, {
    id: 2,
    category: 'cartao',
    name: 'Fatura Nubank',
    status: 'overdue',
    dueLabel: 'Venceu 10 jun',
    amount: 'R$ 940,00'
  }, {
    id: 3,
    category: 'fixas',
    name: 'Energia · CEMIG',
    status: 'pending',
    dueLabel: 'Vence 22 jun',
    amount: 'R$ 210,00'
  }, {
    id: 4,
    category: 'fixas',
    name: 'Internet · Vivo',
    status: 'paid',
    dueLabel: 'Pago 08 jun',
    amount: 'R$ 120,00'
  }],
  transactions: [{
    id: 1,
    category: 'outros',
    description: 'Salário',
    meta: '05 jun · Transferência',
    amount: 'R$ 6.500,00',
    type: 'income'
  }, {
    id: 2,
    category: 'mercado',
    description: 'Mercado da semana',
    meta: '12 jun · Cartão de crédito',
    amount: 'R$ 240,00',
    type: 'expense'
  }, {
    id: 3,
    category: 'transporte',
    description: 'Combustível',
    meta: '13 jun · Débito',
    amount: 'R$ 180,00',
    type: 'expense'
  }, {
    id: 4,
    category: 'lazer',
    description: 'Cinema em família',
    meta: '14 jun · Cartão de crédito',
    amount: 'R$ 96,00',
    type: 'expense'
  }, {
    id: 5,
    category: 'saude',
    description: 'Farmácia',
    meta: '15 jun · Pix',
    amount: 'R$ 64,00',
    type: 'expense'
  }, {
    id: 6,
    category: 'outros',
    description: 'Freela design',
    meta: '16 jun · Pix',
    amount: 'R$ 900,00',
    type: 'income'
  }],
  categories: [{
    category: 'moradia',
    label: 'Moradia',
    amount: 'R$ 1.800,00',
    percent: 42,
    value: 1800
  }, {
    category: 'mercado',
    label: 'Mercado',
    amount: 'R$ 720,00',
    percent: 17,
    value: 720
  }, {
    category: 'transporte',
    label: 'Transporte',
    amount: 'R$ 380,00',
    percent: 12,
    value: 380
  }, {
    category: 'cartao',
    label: 'Cartão de crédito',
    amount: 'R$ 540,00',
    percent: 17,
    value: 540
  }, {
    category: 'lazer',
    label: 'Lazer',
    amount: 'R$ 240,00',
    percent: 8,
    value: 240
  }, {
    category: 'saude',
    label: 'Saúde',
    amount: 'R$ 140,00',
    percent: 4,
    value: 140
  }],
  goal: {
    label: 'Meta: Reserva de emergência',
    current: 5800,
    target: 10000,
    currentLabel: 'R$ 5.800',
    targetLabel: 'R$ 10.000'
  },
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/data.js", error: String((e && e.message) || e) }); }

// ui_kits/icons.js
try { (() => {
// Shared Lucide-style inline icons for the UI kits (stroke 2, 24px grid).
window.CFIcon = function () {
  const I = (paths, props = {}) => ({
    size = 20,
    ...rest
  } = {}) => React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props,
    ...rest
  }, paths.map((d, i) => React.createElement('path', {
    key: i,
    d
  })));
  const C = els => ({
    size = 20,
    ...rest
  } = {}) => React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...rest
  }, els);
  return {
    home: I(['m3 9.5 9-7 9 7', 'M9 22V12h6v10', 'M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9']),
    list: I(['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01']),
    bills: I(['M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3Z', 'M8 8h8', 'M8 12h8']),
    chart: I(['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3']),
    target: C([React.createElement('circle', {
      key: 0,
      cx: 12,
      cy: 12,
      r: 9
    }), React.createElement('circle', {
      key: 1,
      cx: 12,
      cy: 12,
      r: 5
    }), React.createElement('circle', {
      key: 2,
      cx: 12,
      cy: 12,
      r: 1
    })]),
    settings: C([React.createElement('circle', {
      key: 0,
      cx: 12,
      cy: 12,
      r: 3
    }), React.createElement('path', {
      key: 1,
      d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z'
    })]),
    wallet: I(['M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7', 'M16 12h.01']),
    up: I(['M16 7h6v6', 'm22 7-8.5 8.5-5-5L2 17']),
    down: I(['M16 17h6v-6', 'm22 17-8.5-8.5-5 5L2 7']),
    piggy: I(['M19 9a4 4 0 0 0-4-4H9a6 6 0 0 0-6 6 5 5 0 0 0 2 4v3h3v-2h4v2h3v-2.5A5 5 0 0 0 20 11h1V8l-2 1Z', 'M15 9h.01']),
    plus: I(['M12 5v14', 'M5 12h14']),
    bell: I(['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0']),
    search: C([React.createElement('circle', {
      key: 0,
      cx: 11,
      cy: 11,
      r: 8
    }), React.createElement('path', {
      key: 1,
      d: 'm21 21-4.3-4.3'
    })]),
    chevronDown: I(['m6 9 6 6 6-6']),
    calendar: C([React.createElement('rect', {
      key: 0,
      x: 3,
      y: 4,
      width: 18,
      height: 18,
      rx: 2
    }), React.createElement('path', {
      key: 1,
      d: 'M16 2v4M8 2v4M3 10h18'
    })]),
    moon: I(['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z']),
    sun: C([React.createElement('circle', {
      key: 0,
      cx: 12,
      cy: 12,
      r: 4
    }), React.createElement('path', {
      key: 1,
      d: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'
    })]),
    menu: I(['M3 6h18', 'M3 12h18', 'M3 18h18']),
    arrowDownLeft: I(['M17 7 7 17', 'M17 17H7V7']),
    arrowUpRight: I(['M7 17 17 7', 'M7 7h10v10']),
    x: I(['M18 6 6 18', 'M6 6l12 12']),
    check: I(['M20 6 9 17l-5-5'])
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/icons.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Landing — marketing page for Controle Financeiro Residencial.
function Landing() {
  const I = window.CFIcon;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const {
    Button,
    Card,
    Badge,
    SummaryCard,
    CategoryBar,
    CategoryDonut,
    Switch
  } = DS;
  const D = window.CF_DATA;
  const [annual, setAnnual] = React.useState(true);
  const features = [{
    icon: I.wallet,
    title: 'Saldo sempre claro',
    text: 'Receitas, despesas e economia do mês em um só painel, atualizados a cada lançamento.'
  }, {
    icon: I.bills,
    title: 'Nunca perca um vencimento',
    text: 'Contas a pagar com alertas de vencimento próximo e marcação de pagas em um toque.'
  }, {
    icon: I.chart,
    title: 'Para onde vai o dinheiro',
    text: 'Gráfico de despesas por categoria que mostra onde a casa mais gasta.'
  }, {
    icon: I.target,
    title: 'Metas que acontecem',
    text: 'Defina objetivos de economia e acompanhe o progresso da reserva da família.'
  }];
  const cats = ['Moradia', 'Mercado', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Cartão de crédito', 'Contas fixas', 'Outros'];
  const catKeys = ['moradia', 'mercado', 'transporte', 'saude', 'educacao', 'lazer', 'cartao', 'fixas', 'outros'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'color-mix(in srgb, var(--bg-app) 86%, transparent)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: 'var(--action)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(I.piggy, {
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, "Controle Financeiro")), /*#__PURE__*/React.createElement("nav", {
    className: "cf-navlinks",
    style: {
      display: 'flex',
      gap: 26,
      alignItems: 'center'
    }
  }, ['Recursos', 'Categorias', 'Preços'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: 15,
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      fontWeight: 500
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Entrar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Come\xE7ar gr\xE1tis")))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '72px 24px 40px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    },
    className: "cf-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "action",
    dot: true
  }, "Simples para toda a fam\xEDlia"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '18px 0 0',
      fontSize: 'clamp(34px, 5vw, 48px)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
      color: 'var(--text-primary)'
    }
  }, "As finan\xE7as da sua casa, finalmente organizadas"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 0',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      maxWidth: 460
    }
  }, "Controle receitas, despesas e contas a pagar, acompanhe metas de economia e veja para onde vai o dinheiro \u2014 tudo em um painel claro e f\xE1cil."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 28,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(I.arrowUpRight, {
      size: 18
    })
  }, "Criar conta gr\xE1tis"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Ver demonstra\xE7\xE3o")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      marginTop: 28,
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 16
  }), " Sem cart\xE3o de cr\xE9dito"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 16
  }), " 100% em portugu\xEAs"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "Vis\xE3o geral \xB7 Junho"), /*#__PURE__*/React.createElement(Badge, {
    tone: "positive",
    dot: true
  }, "Saldo positivo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(SummaryCard, {
    label: "Saldo atual",
    value: D.saldo,
    tone: "action",
    icon: /*#__PURE__*/React.createElement(I.wallet, {
      size: 18
    })
  }), /*#__PURE__*/React.createElement(SummaryCard, {
    label: "Economia",
    value: D.economia,
    tone: "positive",
    icon: /*#__PURE__*/React.createElement(I.piggy, {
      size: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'center',
      padding: 14,
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(CategoryDonut, {
    total: D.despesas.replace(',00', ''),
    totalLabel: "Despesas",
    size: 120,
    data: D.categories.map(c => ({
      category: c.category,
      value: c.value
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, D.categories.slice(0, 3).map(c => /*#__PURE__*/React.createElement(CategoryBar, _extends({
    key: c.category
  }, c, {
    showIcon: false
  })))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '56px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto 40px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, "Tudo o que a casa precisa"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 17,
      color: 'var(--text-secondary)'
    }
  }, "Ferramentas simples para quem est\xE1 come\xE7ando a organizar a vida financeira.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 18
    }
  }, features.map(f => /*#__PURE__*/React.createElement(Card, {
    key: f.title,
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'var(--action-soft)',
      color: 'var(--action)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(f.icon, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      color: 'var(--text-secondary)'
    }
  }, f.text))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '56px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, "Categorias para cada gasto"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
      marginTop: 28
    }
  }, cats.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 16px',
      background: 'var(--bg-app)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-full)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 4,
      background: `var(--cat-${catKeys[i]})`
    }
  }), c))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '64px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, "Comece gr\xE1tis, evolua quando quiser"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 18,
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, "Mensal ", /*#__PURE__*/React.createElement(Switch, {
    checked: annual,
    onChange: setAnnual
  }), " Anual ", /*#__PURE__*/React.createElement(Badge, {
    tone: "positive",
    size: "sm"
  }, "\u221220%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 18,
      maxWidth: 760,
      margin: '32px auto 0',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text-secondary)'
    }
  }, "Fam\xEDlia"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "R$ 0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "Para sempre. Tudo o que um lar precisa."), ['Receitas e despesas ilimitadas', 'Contas a pagar', 'Gráfico por categoria'].map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      display: 'flex',
      gap: 8,
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--positive)'
    }
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 18
  })), p)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true
  }, "Come\xE7ar gr\xE1tis")), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      border: '1.5px solid var(--action)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--action)'
    }
  }, "Fam\xEDlia+"), /*#__PURE__*/React.createElement(Badge, {
    tone: "action"
  }, "Popular")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, annual ? 'R$ 12' : 'R$ 15', /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--text-secondary)'
    }
  }, "/m\xEAs")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "Metas, relat\xF3rios e exporta\xE7\xE3o."), ['Tudo do plano Família', 'Metas de economia', 'Relatórios mensais em PDF', 'Múltiplos perfis'].map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      display: 'flex',
      gap: 8,
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--positive)'
    }
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 18
  })), p)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true
  }, "Assinar Fam\xEDlia+")))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 24px 72px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--action)',
      borderRadius: 'var(--radius-2xl)',
      padding: '48px 32px',
      textAlign: 'center',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Organize as finan\xE7as da sua casa hoje"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 24px',
      fontSize: 17,
      opacity: 0.9
    }
  }, "Leva menos de 2 minutos para come\xE7ar. Sem cart\xE3o de cr\xE9dito."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    style: {
      background: '#fff',
      color: 'var(--action)',
      border: 'none'
    }
  }, "Criar conta gr\xE1tis"))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '28px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--text-secondary)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: 'var(--action)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(I.piggy, {
    size: 16
  })), "\xA9 2026 Controle Financeiro Residencial"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Privacidade"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Termos"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Ajuda")))));
}
window.Landing = Landing;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/MobileApp.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// MobileApp — phone-framed household finance app (mobile-first screens).
function MobileApp() {
  const I = window.CFIcon;
  const D = window.CF_DATA;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const {
    SummaryCard,
    BillItem,
    TransactionRow,
    CategoryBar,
    CategoryDonut,
    Card,
    Badge,
    Button,
    SegmentedControl,
    ProgressBar
  } = DS;
  const [tab, setTab] = React.useState('home');
  const [sheet, setSheet] = React.useState(false);
  const [type, setType] = React.useState('expense');
  const tabs = [{
    key: 'home',
    label: 'Início',
    icon: I.home
  }, {
    key: 'tx',
    label: 'Extrato',
    icon: I.list
  }, {
    key: 'add',
    label: '',
    icon: I.plus
  }, {
    key: 'bills',
    label: 'Contas',
    icon: I.bills
  }, {
    key: 'reports',
    label: 'Relatórios',
    icon: I.chart
  }];
  const Header = ({
    title,
    sub
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, sub), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, title));
  const Home = () => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '0 16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--action)',
      borderRadius: 'var(--radius-xl)',
      padding: 20,
      color: '#fff',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.85,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(I.wallet, {
    size: 16
  }), " Saldo atual"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      marginTop: 6,
      fontVariantNumeric: 'tabular-nums'
    }
  }, D.saldo), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.8
    }
  }, "Receitas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, D.receitas)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.8
    }
  }, "Despesas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, D.despesas)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.8
    }
  }, "Economia"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, D.economia)))), /*#__PURE__*/React.createElement(Section, {
    title: "Contas a pagar",
    badge: /*#__PURE__*/React.createElement(Badge, {
      tone: "warning",
      dot: true
    }, "2 em breve")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, D.bills.slice(0, 3).map(b => /*#__PURE__*/React.createElement(BillItem, _extends({
    key: b.id
  }, b, {
    onPay: () => {}
  }))))), /*#__PURE__*/React.createElement(Section, {
    title: "Despesas por categoria"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(CategoryDonut, {
    total: D.despesas.replace(',00', ''),
    totalLabel: "Despesas",
    size: 150,
    data: D.categories.map(c => ({
      category: c.category,
      value: c.value
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, D.categories.slice(0, 4).map(c => /*#__PURE__*/React.createElement(CategoryBar, _extends({
    key: c.category
  }, c))))))), /*#__PURE__*/React.createElement(Section, {
    title: "\xDAltimas movimenta\xE7\xF5es"
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "sm"
  }, D.transactions.slice(0, 4).map((t, i) => /*#__PURE__*/React.createElement(TransactionRow, _extends({
    key: t.id
  }, t, {
    divider: i < 3
  }))))));
  const Extrato = () => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    style: {
      width: '100%'
    },
    value: "todos",
    onChange: () => {},
    options: [{
      value: 'todos',
      label: 'Todos'
    }, {
      value: 'rec',
      label: 'Receitas'
    }, {
      value: 'desp',
      label: 'Despesas'
    }]
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "sm"
  }, D.transactions.map((t, i) => /*#__PURE__*/React.createElement(TransactionRow, _extends({
    key: t.id
  }, t, {
    divider: i < D.transactions.length - 1
  })))));
  const Bills = () => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, D.bills.map(b => /*#__PURE__*/React.createElement(BillItem, _extends({
    key: b.id
  }, b, {
    onPay: () => {}
  }))));
  const Reports = () => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(CategoryDonut, {
    total: D.despesas.replace(',00', ''),
    totalLabel: "Total m\xEAs",
    size: 170,
    data: D.categories.map(c => ({
      category: c.category,
      value: c.value
    }))
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, D.categories.map(c => /*#__PURE__*/React.createElement(CategoryBar, _extends({
    key: c.category
  }, c))))));
  function Section({
    title,
    badge,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--text-primary)'
      }
    }, title), badge), children);
  }
  const screens = {
    home: /*#__PURE__*/React.createElement(Home, null),
    tx: /*#__PURE__*/React.createElement(Extrato, null),
    bills: /*#__PURE__*/React.createElement(Bills, null),
    reports: /*#__PURE__*/React.createElement(Reports, null)
  };
  const heads = {
    home: ['Olá, Ana 👋', 'Junho de 2026'],
    tx: ['Extrato', 'Junho de 2026'],
    bills: ['Contas a pagar', '4 contas neste mês'],
    reports: ['Relatórios', 'Gastos de junho']
  };
  const [ht, hs] = heads[tab] || heads.home;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    title: ht,
    sub: hs
  }), screens[tab]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 8px 22px',
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, tabs.map(t => {
    if (t.key === 'add') return /*#__PURE__*/React.createElement("button", {
      key: "add",
      onClick: () => setSheet(true),
      style: {
        width: 52,
        height: 52,
        marginTop: -28,
        borderRadius: '50%',
        border: '4px solid var(--bg-app)',
        background: 'var(--action)',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)'
      }
    }, /*#__PURE__*/React.createElement(I.plus, {
      size: 24
    }));
    const on = tab === t.key;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: () => setTab(t.key),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        width: 60,
        padding: '4px 0',
        color: on ? 'var(--action)' : 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement(t.icon, {
      size: 22
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: on ? 700 : 500
      }
    }, t.label));
  })), sheet && /*#__PURE__*/React.createElement("div", {
    onClick: () => setSheet(false),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(15,23,42,0.45)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      background: 'var(--surface-card)',
      borderRadius: '24px 24px 0 0',
      padding: 20,
      paddingBottom: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 99,
      background: 'var(--border-strong)',
      alignSelf: 'center'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 19,
      fontWeight: 700
    }
  }, "Nova transa\xE7\xE3o"), /*#__PURE__*/React.createElement(SegmentedControl, {
    style: {
      width: '100%'
    },
    value: type,
    onChange: setType,
    options: [{
      value: 'expense',
      label: 'Despesa'
    }, {
      value: 'income',
      label: 'Receita'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '14px 16px',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--text-secondary)'
    }
  }, "R$"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--text-tertiary)'
    }
  }, "0,00")), /*#__PURE__*/React.createElement(Button, {
    variant: type === 'income' ? 'positive' : 'primary',
    fullWidth: true,
    size: "lg",
    onClick: () => setSheet(false)
  }, "Salvar ", type === 'income' ? 'receita' : 'despesa'))));
}
window.MobileApp = MobileApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/MobileApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BillItem = __ds_scope.BillItem;

__ds_ns.CategoryBar = __ds_scope.CategoryBar;

__ds_ns.CategoryDonut = __ds_scope.CategoryDonut;

__ds_ns.CategoryIcon = __ds_scope.CategoryIcon;

__ds_ns.SummaryCard = __ds_scope.SummaryCard;

__ds_ns.TransactionRow = __ds_scope.TransactionRow;

})();
