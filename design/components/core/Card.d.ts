import * as React from 'react';

/**
 * Base surface container — the building block of every dashboard panel.
 * @startingPoint section="Core" subtitle="Surface container" viewport="700x200"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover lift + pointer cursor. */
  interactive?: boolean;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
