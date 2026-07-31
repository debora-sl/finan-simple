# UI Kit — Painel Web (Dashboard)

Desktop recreation of the household-finance dashboard ("Visão geral").

- `index.html` — interactive shell: sidebar nav, sticky topbar with month/category filters, dark-mode toggle, and the "Adicionar" modal. Responsive (sidebar collapses to a drawer < 880px).
- `Sidebar.jsx` — primary navigation + theme toggle.
- `Topbar.jsx` — page title, month & category `select` filters, add button.
- `AddTransactionModal.jsx` — dialog for new receita/despesa.
- `DashboardScreen.jsx` — summary cards, category chart, transactions, contas a pagar, savings goal.
- `data.js` — shared mock data (also used by the mobile kit).

Composes the design-system primitives (`SummaryCard`, `BillItem`, `TransactionRow`, `CategoryBar`, `CategoryDonut`, `Card`, `Button`, `Badge`, `ProgressBar`) from `window.ControleFinanceiroDesignSystem_2e2cd7`. Icons come from `../icons.js`.
