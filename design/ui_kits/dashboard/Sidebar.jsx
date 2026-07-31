// Sidebar — primary navigation for the desktop dashboard.
function Sidebar({ active = 'home', onNavigate, theme, onToggleTheme }) {
  const I = window.CFIcon;
  const items = [
    { key: 'home', label: 'Visão geral', icon: I.home },
    { key: 'transactions', label: 'Movimentações', icon: I.list },
    { key: 'bills', label: 'Contas a pagar', icon: I.bills },
    { key: 'reports', label: 'Relatórios', icon: I.chart },
    { key: 'goals', label: 'Metas', icon: I.target },
  ];
  return (
    <aside style={{
      width: 248, flexShrink: 0, height: '100%', boxSizing: 'border-box',
      background: 'var(--surface-card)', borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', padding: '20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 22px' }}>
        <span style={{
          width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--action)',
          color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><I.piggy size={22} /></span>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Controle</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Financeiro</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {items.map((it) => {
          const on = active === it.key;
          return (
            <button key={it.key} onClick={() => onNavigate && onNavigate(it.key)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: 'none',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
              background: on ? 'var(--action-soft)' : 'transparent',
              color: on ? 'var(--action-soft-fg)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: on ? 600 : 500,
              transition: 'background var(--dur-fast)',
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <it.icon size={19} /> {it.label}
            </button>
          );
        })}
      </nav>

      <button onClick={onToggleTheme} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: 'none',
        borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--bg-subtle)',
        color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
      }}>
        {theme === 'dark' ? <I.sun size={18} /> : <I.moon size={18} />}
        {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      </button>
    </aside>
  );
}
window.Sidebar = Sidebar;
