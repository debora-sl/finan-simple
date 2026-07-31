import * as React from 'react';

export type CategoryKey =
  | 'moradia' | 'mercado' | 'transporte' | 'saude' | 'educacao'
  | 'lazer' | 'cartao' | 'fixas' | 'outros';

/** Colored chip + glyph for a household expense category. The canonical
 *  category color/icon source — reuse instead of redefining per screen. */
export interface CategoryIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: CategoryKey;
  /** Chip size in px. @default 40 */
  size?: number;
}
export declare function CategoryIcon(props: CategoryIconProps): JSX.Element;
