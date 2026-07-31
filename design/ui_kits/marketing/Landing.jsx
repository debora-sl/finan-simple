// Landing — marketing page for Controle Financeiro Residencial.
function Landing() {
  const I = window.CFIcon;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const { Button, Card, Badge, SummaryCard, CategoryBar, CategoryDonut, Switch } = DS;
  const D = window.CF_DATA;
  const [annual, setAnnual] = React.useState(true);

  const features = [
    { icon: I.wallet, title: 'Saldo sempre claro', text: 'Receitas, despesas e economia do mês em um só painel, atualizados a cada lançamento.' },
    { icon: I.bills, title: 'Nunca perca um vencimento', text: 'Contas a pagar com alertas de vencimento próximo e marcação de pagas em um toque.' },
    { icon: I.chart, title: 'Para onde vai o dinheiro', text: 'Gráfico de despesas por categoria que mostra onde a casa mais gasta.' },
    { icon: I.target, title: 'Metas que acontecem', text: 'Defina objetivos de economia e acompanhe o progresso da reserva da família.' },
  ];
  const cats = ['Moradia','Mercado','Transporte','Saúde','Educação','Lazer','Cartão de crédito','Contas fixas','Outros'];
  const catKeys = ['moradia','mercado','transporte','saude','educacao','lazer','cartao','fixas','outros'];

  return (
    <div style={{ background: 'var(--bg-app)' }}>
      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'color-mix(in srgb, var(--bg-app) 86%, transparent)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, padding: '14px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--action)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><I.piggy size={20} /></span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Controle Financeiro</span>
          </div>
          <nav className="cf-navlinks" style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
            {['Recursos','Categorias','Preços'].map((l) => <a key={l} href="#" style={{ fontSize: 15, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>{l}</a>)}
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost">Entrar</Button>
            <Button variant="primary">Começar grátis</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="cf-hero">
        <div>
          <Badge tone="action" dot>Simples para toda a família</Badge>
          <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(34px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--text-primary)' }}>
            As finanças da sua casa, finalmente organizadas
          </h1>
          <p style={{ margin: '18px 0 0', fontSize: 18, lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 460 }}>
            Controle receitas, despesas e contas a pagar, acompanhe metas de economia e veja para onde vai o dinheiro — tudo em um painel claro e fácil.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight={<I.arrowUpRight size={18} />}>Criar conta grátis</Button>
            <Button variant="secondary" size="lg">Ver demonstração</Button>
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 28, fontSize: 14, color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><I.check size={16} /> Sem cartão de crédito</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><I.check size={16} /> 100% em português</span>
          </div>
        </div>

        {/* Hero preview card */}
        <div style={{ position: 'relative' }}>
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Visão geral · Junho</div>
              <Badge tone="positive" dot>Saldo positivo</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <SummaryCard label="Saldo atual" value={D.saldo} tone="action" icon={<I.wallet size={18} />} />
              <SummaryCard label="Economia" value={D.economia} tone="positive" icon={<I.piggy size={18} />} />
            </div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)' }}>
              <CategoryDonut total={D.despesas.replace(',00','')} totalLabel="Despesas" size={120}
                data={D.categories.map((c) => ({ category: c.category, value: c.value }))} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {D.categories.slice(0, 3).map((c) => <CategoryBar key={c.category} {...c} showIcon={false} />)}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Tudo o que a casa precisa</h2>
          <p style={{ margin: '12px 0 0', fontSize: 17, color: 'var(--text-secondary)' }}>Ferramentas simples para quem está começando a organizar a vida financeira.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {features.map((f) => (
            <Card key={f.title} interactive style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--action-soft)', color: 'var(--action)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><f.icon size={24} /></span>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{f.text}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories band */}
      <section style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Categorias para cada gasto</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 28 }}>
            {cats.map((c, i) => (
              <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: `var(--cat-${catKeys[i]})` }} />{c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Comece grátis, evolua quando quiser</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 18, fontSize: 15, color: 'var(--text-secondary)' }}>
          Mensal <Switch checked={annual} onChange={setAnnual} /> Anual <Badge tone="positive" size="sm">−20%</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, maxWidth: 760, margin: '32px auto 0', textAlign: 'left' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>Família</div>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>R$ 0</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Para sempre. Tudo o que um lar precisa.</div>
            {['Receitas e despesas ilimitadas','Contas a pagar','Gráfico por categoria'].map((p) => (
              <div key={p} style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--text-primary)' }}><span style={{ color: 'var(--positive)' }}><I.check size={18} /></span>{p}</div>
            ))}
            <Button variant="secondary" fullWidth>Começar grátis</Button>
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 14, border: '1.5px solid var(--action)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--action)' }}>Família+</div>
              <Badge tone="action">Popular</Badge>
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>{annual ? 'R$ 12' : 'R$ 15'}<span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-secondary)' }}>/mês</span></div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Metas, relatórios e exportação.</div>
            {['Tudo do plano Família','Metas de economia','Relatórios mensais em PDF','Múltiplos perfis'].map((p) => (
              <div key={p} style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--text-primary)' }}><span style={{ color: 'var(--positive)' }}><I.check size={18} /></span>{p}</div>
            ))}
            <Button variant="primary" fullWidth>Assinar Família+</Button>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 72px' }}>
        <div style={{ background: 'var(--action)', borderRadius: 'var(--radius-2xl)', padding: '48px 32px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>Organize as finanças da sua casa hoje</h2>
          <p style={{ margin: '12px 0 24px', fontSize: 17, opacity: 0.9 }}>Leva menos de 2 minutos para começar. Sem cartão de crédito.</p>
          <Button variant="secondary" size="lg" style={{ background: '#fff', color: 'var(--action)', border: 'none' }}>Criar conta grátis</Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--action)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><I.piggy size={16} /></span>
            © 2026 Controle Financeiro Residencial
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidade</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Termos</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
window.Landing = Landing;
