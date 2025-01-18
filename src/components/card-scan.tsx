import { imageUrl } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { useAgathaEasterEggTransform } from "@/utils/easter-egg-agatha";
import css from "./card-scan.module.css";

type Props = {
  code: string;
  className?: string;
  sideways?: boolean;
  suffix?: string;
  lazy?: boolean;
};

export function CardScan(props: Props) {
  const { code, className, lazy, sideways, suffix } = props;

  const imageCode = useAgathaEasterEggTransform(`${code}${suffix ?? ""}`);

  return (
    <div className={cx(css["scan"], className)} data-testid="card-scan">
      <img
        loading={lazy ? "lazy" : undefined}
        alt={`Scan of card ${imageCode}`}
        height={sideways ? 300 : 420}
        src={imageUrl(imageCode)}
        width={sideways ? 420 : 300}
      />
    </div>
  );
}
