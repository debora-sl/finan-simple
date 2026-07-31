import * as React from 'react';
import type { CategoryKey } from './CategoryIcon';

export interface DonutSlice { category?: CategoryKey; color?: string; value: number; }
/** Simple expenses-by-category donut with a centered total. */
export interface CategoryDonutProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DonutSlice[];
  /** Pre-formatted total shown in the center, e.g. "R$ 3.120". */
  total?: string;
  totalLabel?: string;
  size?: number;
  thickness?: number;
}
export declare function CategoryDonut(props: CategoryDonutProps): JSX.Element;
