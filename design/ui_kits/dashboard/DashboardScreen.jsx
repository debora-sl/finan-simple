// DashboardScreen — the "Visão geral" view composing summary cards,
// bills, transactions, the category chart and a savings goal.
function DashboardScreen({ onAdd, category }) {
  const I = window.CFIcon;
  const D = window.CF_DATA;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const { SummaryCard, BillItem, TransactionRow, CategoryBar, CategoryDonut, Card, ProgressBar, Button, Badge } = DS;

  const [bills, setBills] = React.useState(D.bills);
  const pay = (id) => setBills((bs) => bs.map((b) => b.id === id ? { ...b, status: 'paid', dueLabel: 'Pago agora' } : b));

  const tx = category && category !== 'all' ? D.transactions.filter((t) => t.category === category) : D.transactions;
  const goalPct = Math.round((D.goal.current / D.goal.target) * 100);

  const Section = ({ title, action, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1160 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <SummaryCard label="Saldo atual" value={D.saldo} tone="action" icon={<I.wallet size={20} />} delta="8%" deltaDirection="up" />
        <SummaryCard label="Receitas do mês" value={D.receitas} tone="positive" icon={<I.arrowDownLeft size={20} />} delta="3%" deltaDirection="up" />
        <SummaryCard label="Despesas do mês" value={D.despesas} tone="negative" icon={<I.arrowUpRight size={20} />} delta="5%" deltaDirection="down" />
        <SummaryCard label="Economia do mês" value={D.economia} tone="positive" icon={<I.piggy size={20} />} delta="12%" deltaDirection="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }} className="cf-cols">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Section title="Despesas por categoria" action={<Badge tone="neutral">Junho</Badge>}>
            <Card>
              <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                <CategoryDonut total={D.despesas.replace(',00','')} totalLabel="Despesas" size={168}
                  data={D.categories.map((c) => ({ category: c.category, value: c.value }))} />
                <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {D.categories.slice(0, 5).map((c) => <CategoryBar key={c.category} {...c} />)}
                </div>
              </div>
            </Card>
          </Section>

          <Section title="Últimas movimentações" action={<Button variant="ghost" size="sm">Ver todas</Button>}>
            <Card padding="sm">
              {tx.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>Nenhuma movimentação nesta categoria.</div>}
              {tx.map((t, i) => <TransactionRow key={t.id} {...t} divider={i < tx.length - 1} />)}
            </Card>
          </Section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Section title="Contas a pagar" action={<Badge tone="warning" dot>2 vencem em breve</Badge>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bills.map((b) => <BillItem key={b.id} {...b} onPay={() => pay(b.id)} />)}
            </div>
          </Section>

          <Section title="Meta de economia">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--positive-soft)', color: 'var(--positive)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><I.target size={22} /></span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Reserva de emergência</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{D.goal.currentLabel} de {D.goal.targetLabel}</div>
                </div>
              </div>
              <ProgressBar value={D.goal.current} max={D.goal.target} tone="positive" height={10} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{goalPct}% concluído</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--positive-fg)' }}>Faltam R$ 4.200</span>
              </div>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
}
window.DashboardScreen = DashboardScreen;
