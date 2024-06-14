import css from "./quantity-output.module.css";

type Props = {
  value: number;
};

export function QuantityOutput({ value }: Props) {
  return (
    <span className={css["quantity-output"]}>
      <strong className={css["quantity-output-value"]}>{value}</strong>
      <span className={css["quantity-output-x"]}>×</span>
    </span>
  );
}
