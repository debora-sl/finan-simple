// AddTransactionModal — dialog to add a receita or despesa.
function AddTransactionModal({ open, onClose, onSave }) {
  const I = window.CFIcon;
  const DS = window.ControleFinanceiroDesignSystem_2e2cd7;
  const { Button, Input, Select, SegmentedControl } = DS;
  const [type, setType] = React.useState('expense');
  const [amount, setAmount] = React.useState('');
  const [desc, setDesc] = React.useState('');
  if (!open) return null;

  const isIncome = type === 'income';
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 'min(460px, 100%)', background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Nova transação</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}><I.x size={22} /></button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <SegmentedControl value={type} onChange={setType} style={{ width: '100%' }}
            options={[{ value: 'expense', label: 'Despesa' }, { value: 'income', label: 'Receita' }]} />
          <Input label="Valor" prefix="R$" placeholder="0,00" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Descrição" placeholder={isIncome ? 'Ex: Salário' : 'Ex: Mercado da semana'} value={desc} onChange={(e) => setDesc(e.target.value)} />
          <Select label="Categoria" options={['Moradia','Mercado','Transporte','Saúde','Educação','Lazer','Cartão de crédito','Contas fixas','Outros']} />
          <Select label="Data" options={['Hoje · 18 jun','Ontem · 17 jun','Escolher outra data…']} />
        </div>

        <div style={{ display: 'flex', gap: 12, padding: '0 24px 24px' }}>
          <Button variant="secondary" fullWidth onClick={onClose}>Cancelar</Button>
          <Button variant={isIncome ? 'positive' : 'primary'} fullWidth onClick={() => onSave && onSave({ type, amount, desc })}>
            Salvar {isIncome ? 'receita' : 'despesa'}
          </Button>
        </div>
      </div>
    </div>
  );
}
window.AddTransactionModal = AddTransactionModal;
