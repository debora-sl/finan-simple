import * as React from 'react';

/** Horizontal meter for savings goals and budget usage. */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  tone?: 'action' | 'positive' | 'warning' | 'negative';
  height?: number;
  showLabel?: boolean;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
