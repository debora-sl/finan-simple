import * as React from 'react';

/** Square single-icon button for toolbars and card actions. Always pass `label` for a11y. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (also the tooltip). */
  label: string;
  children?: React.ReactNode;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
