import css from "./quantity-output.module.css";

type Props = {
  value: number;
};

export function QuantityOutput({ value }: Props) {
  return (
    <span className={css["container"]}>
      <strong className={css["value"]}>{value}</strong>
      <span className={css["x"]}>×</span>
    </span>
  );
}
