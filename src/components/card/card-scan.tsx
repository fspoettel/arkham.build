import { cx } from "@/utils/cx";

import { imageUrl } from "@/utils/card-utils";

import css from "./card.module.css";

type Props = {
  code: string;
  className?: string;
  sideways?: boolean;
  suffix?: string;
};

export function CardScan(props: Props) {
  const { code, className, sideways, suffix } = props;

  const imageCode = `${code}${suffix ?? ""}`;

  return (
    <div className={cx(css["scan"], className)} data-testid="card-scan">
      <img
        alt={`Scan of card ${imageCode}`}
        height={sideways ? 300 : 420}
        src={imageUrl(imageCode)}
        width={sideways ? 420 : 300}
      />
    </div>
  );
}
