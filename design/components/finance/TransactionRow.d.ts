import * as React from 'react';
import type { CategoryKey } from './CategoryIcon';

/** A single transaction line for "Últimas movimentações" lists. */
export interface TransactionRowProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: CategoryKey;
  description: string;
  /** Secondary line, e.g. "12 jun · Cartão Nubank". */
  meta?: string;
  /** Pre-formatted value, e.g. "R$ 240,00" (sign is added by `type`). */
  amount: string;
  type?: 'income' | 'expense';
  divider?: boolean;
}
export declare function TransactionRow(props: TransactionRowProps): JSX.Element;
