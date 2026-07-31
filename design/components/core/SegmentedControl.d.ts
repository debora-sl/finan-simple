import * as React from 'react';

/** Inline single-select for short option sets (period toggle, small tab groups). */
export interface SegmentedControlProps {
  options: Array<{ value: string; label: string } | string>;
  value: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
