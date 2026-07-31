import * as React from 'react';
import type { CategoryKey } from './CategoryIcon';

/** One row of the "Despesas por categoria" breakdown — icon, bar, amount, %. */
export interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: CategoryKey;
  label: string;
  amount: string;
  /** Share of total, 0–100. */
  percent?: number;
  showIcon?: boolean;
}
export declare function CategoryBar(props: CategoryBarProps): JSX.Element;
