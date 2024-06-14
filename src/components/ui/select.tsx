import type { ComponentProps } from "react";

type Props = ComponentProps<"select"> & {
  options: {
    label: string;
    value: string;
  }[];
};

export function Select({ options, ...rest }: Props) {
  return (
    <select {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
