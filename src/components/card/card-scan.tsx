import { cx } from "@/utils/cx";

import { imageUrl } from "@/utils/card-utils";

import css from "./card.module.css";

type Props = {
  code: string;
  className?: string;
  sideways?: boolean;
};

export function CardScan(props: Props) {
  const { code, className, sideways } = props;
  return (
    <div className={cx(css["scan"], className)}>
      <img
        alt={`Scan of card ${code}`}
        height={sideways ? 300 : 420}
        src={imageUrl(code)}
        width={sideways ? 420 : 300}
      />
    </div>
  );
}
