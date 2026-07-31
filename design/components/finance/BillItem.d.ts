import * as React from 'react';
import type { CategoryKey } from './CategoryIcon';

/** A bill in the "Contas a pagar" section. Status sets the badge tone. */
export interface BillItemProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: CategoryKey;
  name: string;
  /** Due text shown in the badge, e.g. "Vence em 3 dias" / "Venceu 10 jun". */
  dueLabel?: string;
  amount: string;
  status?: 'pending' | 'duesoon' | 'overdue' | 'paid';
  onPay?: () => void;
}
export declare function BillItem(props: BillItemProps): JSX.Element;
