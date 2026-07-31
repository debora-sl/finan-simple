// Topbar — page header with title, month/category filters, and add button.
function Topbar({ title, subtitle, month, onMonth, category, onCategory, onAdd, onMenu }) {
  const I = window.CFIcon;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const { Button, IconButton } = DS;
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '18px 28px',
      borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-app)',
      position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap',
    }}>
      <button onClick={onMenu} className="cf-menu-btn" style={{
        display: 'none', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', padding: 4,
      }}><I.menu size={24} /></button>

      <div style={{ flex: 1, minWidth: 180 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p style={{ margin: '3px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>

      <div className="cf-filters" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <select value={month} onChange={(e) => onMonth && onMonth(e.target.value)} style={selStyle}>
            {(window.CF_DATA.months).map((m, i) => <option key={m} value={i}>{m} 2026</option>)}
          </select>
          <span style={selChevron}><I.chevronDown size={16} /></span>
        </div>
        <div style={{ position: 'relative' }}>
          <select value={category} onChange={(e) => onCategory && onCategory(e.target.value)} style={selStyle}>
            <option value="all">Todas as categorias</option>
            <option value="moradia">Moradia</option>
            <option value="mercado">Mercado</option>
            <option value="transporte">Transporte</option>
            <option value="cartao">Cartão de crédito</option>
            <option value="lazer">Lazer</option>
          </select>
          <span style={selChevron}><I.chevronDown size={16} /></span>
        </div>
        <IconButton label="Notificações" variant="secondary"><I.bell size={18} /></IconButton>
        <Button variant="primary" iconLeft={<I.plus size={18} />} onClick={onAdd}>Adicionar</Button>
      </div>
    </header>
  );
}

const selStyle = {
  appearance: 'none', WebkitAppearance: 'none', height: 44, padding: '0 36px 0 14px',
  background: 'var(--surface-card)', border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 14,
  fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
};
const selChevron = {
  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
  color: 'var(--text-secondary)', pointerEvents: 'none', display: 'inline-flex',
};
window.Topbar = Topbar;
