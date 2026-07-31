import * as React from 'react';

/** Compact status/category pill. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'action' | 'positive' | 'negative' | 'warning';
  size?: 'sm' | 'md';
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
