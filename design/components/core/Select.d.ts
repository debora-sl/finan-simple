import * as React from 'react';

export interface SelectOption { value: string; label: string; }
/** Labeled dropdown matching Input styling. Pass `options` as {value,label}[] or string[]. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: Array<SelectOption | string>;
}
export declare function Select(props: SelectProps): JSX.Element;
