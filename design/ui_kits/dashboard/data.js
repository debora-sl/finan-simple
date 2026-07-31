// Mock household-finance data for the Controle Financeiro UI kits.
window.CF_DATA = {
  saldo: 'R$ 4.280,00',
  receitas: 'R$ 7.400,00',
  despesas: 'R$ 3.120,00',
  economia: 'R$ 1.160,00',
  bills: [
    { id: 1, category: 'moradia', name: 'Aluguel', status: 'duesoon', dueLabel: 'Vence em 3 dias', amount: 'R$ 1.800,00' },
    { id: 2, category: 'cartao', name: 'Fatura Nubank', status: 'overdue', dueLabel: 'Venceu 10 jun', amount: 'R$ 940,00' },
    { id: 3, category: 'fixas', name: 'Energia · CEMIG', status: 'pending', dueLabel: 'Vence 22 jun', amount: 'R$ 210,00' },
    { id: 4, category: 'fixas', name: 'Internet · Vivo', status: 'paid', dueLabel: 'Pago 08 jun', amount: 'R$ 120,00' },
  ],
  transactions: [
    { id: 1, category: 'outros', description: 'Salário', meta: '05 jun · Transferência', amount: 'R$ 6.500,00', type: 'income' },
    { id: 2, category: 'mercado', description: 'Mercado da semana', meta: '12 jun · Cartão de crédito', amount: 'R$ 240,00', type: 'expense' },
    { id: 3, category: 'transporte', description: 'Combustível', meta: '13 jun · Débito', amount: 'R$ 180,00', type: 'expense' },
    { id: 4, category: 'lazer', description: 'Cinema em família', meta: '14 jun · Cartão de crédito', amount: 'R$ 96,00', type: 'expense' },
    { id: 5, category: 'saude', description: 'Farmácia', meta: '15 jun · Pix', amount: 'R$ 64,00', type: 'expense' },
    { id: 6, category: 'outros', description: 'Freela design', meta: '16 jun · Pix', amount: 'R$ 900,00', type: 'income' },
  ],
  categories: [
    { category: 'moradia', label: 'Moradia', amount: 'R$ 1.800,00', percent: 42, value: 1800 },
    { category: 'mercado', label: 'Mercado', amount: 'R$ 720,00', percent: 17, value: 720 },
    { category: 'transporte', label: 'Transporte', amount: 'R$ 380,00', percent: 12, value: 380 },
    { category: 'cartao', label: 'Cartão de crédito', amount: 'R$ 540,00', percent: 17, value: 540 },
    { category: 'lazer', label: 'Lazer', amount: 'R$ 240,00', percent: 8, value: 240 },
    { category: 'saude', label: 'Saúde', amount: 'R$ 140,00', percent: 4, value: 140 },
  ],
  goal: { label: 'Meta: Reserva de emergência', current: 5800, target: 10000, currentLabel: 'R$ 5.800', targetLabel: 'R$ 10.000' },
  months: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho'],
};
