import React from 'react';

/**
 * CategoryIcon — colored rounded chip with the glyph for a household
 * expense category. Single source of truth for category color + icon.
 */
const CATEGORIES = {
  moradia:    { color: 'var(--cat-moradia)',    label: 'Moradia',            path: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z' },
  mercado:    { color: 'var(--cat-mercado)',    label: 'Mercado',            path: 'M2.5 3h2l2.4 12.3a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' },
  transporte: { color: 'var(--cat-transporte)', label: 'Transporte',         path: 'M5 17H3v-5l2-5h10l3 5h1a2 2 0 0 1 2 2v3h-2m-4 0H9m-4 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z' },
  saude:      { color: 'var(--cat-saude)',      label: 'Saúde',              path: 'M3 12h3l2-5 4 10 2-5h5' },
  educacao:   { color: 'var(--cat-educacao)',   label: 'Educação',           path: 'M12 4 2 9l10 5 10-5-10-5ZM6 11.5V16c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5' },
  lazer:      { color: 'var(--cat-lazer)',      label: 'Lazer',              path: 'M6 11h4M8 9v4m6-2h.01M17 13h.01M17.3 5H6.7A4.7 4.7 0 0 0 2 9.7c0 .8.1 1.6.4 2.4l1.6 5A2.5 2.5 0 0 0 8.4 18l.9-1.4a1.5 1.5 0 0 1 1.3-.7h2.8a1.5 1.5 0 0 1 1.3.7l.9 1.4a2.5 2.5 0 0 0 4.4-.9l1.6-5c.3-.8.4-1.6.4-2.4A4.7 4.7 0 0 0 17.3 5Z' },
  cartao:     { color: 'var(--cat-cartao)',     label: 'Cartão de crédito',  path: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm0 4h20' },
  fixas:      { color: 'var(--cat-fixas)',      label: 'Contas fixas',       path: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3Zm3 5h8M8 12h8' },
  outros:     { color: 'var(--cat-outros)',     label: 'Outros',             path: 'M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' },
};

export function CategoryIcon({ category = 'outros', size = 40, style = {}, ...rest }) {
  const c = CATEGORIES[category] || CATEGORIES.outros;
  const icon = Math.round(size * 0.52);
  return (
    <span
      title={c.label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, flexShrink: 0, borderRadius: 'var(--radius-md)',
        background: `color-mix(in srgb, ${c.color} 14%, transparent)`, color: c.color, ...style,
      }}
      {...rest}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={c.path} />
      </svg>
    </span>
  );
}

CategoryIcon.categories = CATEGORIES;
