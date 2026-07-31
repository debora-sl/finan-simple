import * as React from 'react';

/**
 * Primary action control. Use `primary` for the main CTA per view,
 * `secondary` for adjacent actions, `ghost` for low-emphasis, and
 * `positive`/`negative` for money-affirmative/destructive actions.
 *
 * @startingPoint section="Core" subtitle="Button variants & sizes" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'positive' | 'negative';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
