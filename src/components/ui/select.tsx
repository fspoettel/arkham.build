export type SelectOption = {
  label: string;
  value: string | number;
};

type Props = React.ComponentProps<"select"> & {
  required?: boolean;
  emptyLabel?: string;
  options: SelectOption[];
};

export function Select({ emptyLabel, options, required, ...rest }: Props) {
  return (
    <select {...rest}>
      {!required && <option value="">{emptyLabel}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
