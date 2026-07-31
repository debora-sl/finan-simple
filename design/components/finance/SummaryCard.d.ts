import * as React from 'react';

/**
 * Metric card for the dashboard summary row (Saldo, Receitas, Despesas, Economia).
 * @startingPoint section="Finance" subtitle="Dashboard metric card" viewport="360x180"
 */
export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Pre-formatted money string, e.g. "R$ 4.280,00". */
  value: string;
  tone?: 'neutral' | 'positive' | 'negative' | 'action' | 'warning';
  icon?: React.ReactNode;
  /** Optional change indicator, e.g. "12%". */
  delta?: string;
  deltaDirection?: 'up' | 'down';
}
export declare function SummaryCard(props: SummaryCardProps): JSX.Element;
