// MobileApp — phone-framed household finance app (mobile-first screens).
function MobileApp() {
  const I = window.CFIcon;
  const D = window.CF_DATA;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const { SummaryCard, BillItem, TransactionRow, CategoryBar, CategoryDonut, Card, Badge, Button, SegmentedControl, ProgressBar } = DS;

  const [tab, setTab] = React.useState('home');
  const [sheet, setSheet] = React.useState(false);
  const [type, setType] = React.useState('expense');

  const tabs = [
    { key: 'home', label: 'Início', icon: I.home },
    { key: 'tx', label: 'Extrato', icon: I.list },
    { key: 'add', label: '', icon: I.plus },
    { key: 'bills', label: 'Contas', icon: I.bills },
    { key: 'reports', label: 'Relatórios', icon: I.chart },
  ];

  const Header = ({ title, sub }) => (
    <div style={{ padding: '14px 20px 8px' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sub}</div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{title}</div>
    </div>
  );

  const Home = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '0 16px 24px' }}>
      {/* Balance hero */}
      <div style={{ background: 'var(--action)', borderRadius: 'var(--radius-xl)', padding: 20, color: '#fff', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: 13, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6 }}><I.wallet size={16} /> Saldo atual</div>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{D.saldo}</div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
          <div><div style={{ fontSize: 12, opacity: 0.8 }}>Receitas</div><div style={{ fontSize: 15, fontWeight: 600 }}>{D.receitas}</div></div>
          <div><div style={{ fontSize: 12, opacity: 0.8 }}>Despesas</div><div style={{ fontSize: 15, fontWeight: 600 }}>{D.despesas}</div></div>
          <div><div style={{ fontSize: 12, opacity: 0.8 }}>Economia</div><div style={{ fontSize: 15, fontWeight: 600 }}>{D.economia}</div></div>
        </div>
      </div>

      <Section title="Contas a pagar" badge={<Badge tone="warning" dot>2 em breve</Badge>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {D.bills.slice(0, 3).map((b) => <BillItem key={b.id} {...b} onPay={() => {}} />)}
        </div>
      </Section>

      <Section title="Despesas por categoria">
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <CategoryDonut total={D.despesas.replace(',00','')} totalLabel="Despesas" size={150}
              data={D.categories.map((c) => ({ category: c.category, value: c.value }))} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {D.categories.slice(0, 4).map((c) => <CategoryBar key={c.category} {...c} />)}
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Últimas movimentações">
        <Card padding="sm">
          {D.transactions.slice(0, 4).map((t, i) => <TransactionRow key={t.id} {...t} divider={i < 3} />)}
        </Card>
      </Section>
    </div>
  );

  const Extrato = () => (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SegmentedControl style={{ width: '100%' }} value="todos" onChange={() => {}}
        options={[{ value: 'todos', label: 'Todos' }, { value: 'rec', label: 'Receitas' }, { value: 'desp', label: 'Despesas' }]} />
      <Card padding="sm">
        {D.transactions.map((t, i) => <TransactionRow key={t.id} {...t} divider={i < D.transactions.length - 1} />)}
      </Card>
    </div>
  );

  const Bills = () => (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {D.bills.map((b) => <BillItem key={b.id} {...b} onPay={() => {}} />)}
    </div>
  );

  const Reports = () => (
    <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <CategoryDonut total={D.despesas.replace(',00','')} totalLabel="Total mês" size={170}
            data={D.categories.map((c) => ({ category: c.category, value: c.value }))} />
        </div>
      </Card>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {D.categories.map((c) => <CategoryBar key={c.category} {...c} />)}
        </div>
      </Card>
    </div>
  );

  function Section({ title, badge, children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
          {badge}
        </div>
        {children}
      </div>
    );
  }

  const screens = { home: <Home />, tx: <Extrato />, bills: <Bills />, reports: <Reports /> };
  const heads = {
    home: ['Olá, Ana 👋', 'Junho de 2026'],
    tx: ['Extrato', 'Junho de 2026'],
    bills: ['Contas a pagar', '4 contas neste mês'],
    reports: ['Relatórios', 'Gastos de junho'],
  };
  const [ht, hs] = heads[tab] || heads.home;

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Header title={ht} sub={hs} />
        {screens[tab]}
      </div>

      {/* Bottom nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 8px 22px',
        background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', flexShrink: 0,
      }}>
        {tabs.map((t) => {
          if (t.key === 'add') return (
            <button key="add" onClick={() => setSheet(true)} style={{
              width: 52, height: 52, marginTop: -28, borderRadius: '50%', border: '4px solid var(--bg-app)',
              background: 'var(--action)', color: '#fff', display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)',
            }}><I.plus size={24} /></button>
          );
          const on = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none',
              background: 'transparent', cursor: 'pointer', width: 60, padding: '4px 0',
              color: on ? 'var(--action)' : 'var(--text-tertiary)',
            }}>
              <t.icon size={22} />
              <span style={{ fontSize: 11, fontWeight: on ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add bottom sheet */}
      {sheet && (
        <div onClick={() => setSheet(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface-card)', borderRadius: '24px 24px 0 0', padding: 20, paddingBottom: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border-strong)', alignSelf: 'center' }} />
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700 }}>Nova transação</h2>
            <SegmentedControl style={{ width: '100%' }} value={type} onChange={setType}
              options={[{ value: 'expense', label: 'Despesa' }, { value: 'income', label: 'Receita' }]} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-secondary)' }}>R$</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-tertiary)' }}>0,00</span>
            </div>
            <Button variant={type === 'income' ? 'positive' : 'primary'} fullWidth size="lg" onClick={() => setSheet(false)}>
              Salvar {type === 'income' ? 'receita' : 'despesa'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
window.MobileApp = MobileApp;
