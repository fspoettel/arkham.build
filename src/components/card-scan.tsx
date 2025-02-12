import { imageUrl } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { useAgathaEasterEggTransform } from "@/utils/easter-egg-agatha";
import { useTranslation } from "react-i18next";
import css from "./card-scan.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  className?: string;
  sideways?: boolean;
  suffix?: string;
  lazy?: boolean;
}

export function CardScan(props: Props) {
  const { code, suffix, ...rest } = props;
  const { t } = useTranslation();

  const imageCode = useAgathaEasterEggTransform(`${code}${suffix ?? ""}`);

  return (
    <CardScanInner
      alt={t("card_view.scan", { code: imageCode })}
      url={imageUrl(imageCode)}
      {...rest}
    />
  );
}

export function CardScanInner(
  props: Omit<Props, "code"> & {
    alt: string;
    url: string;
    crossOrigin?: "anonymous";
  },
) {
  const { alt, crossOrigin, sideways, lazy, className, url, ...rest } = props;

  return (
    <div
      className={cx(css["scan"], sideways && css["sideways"], className)}
      data-testid="card-scan"
      data-component="card-scan"
      {...rest}
    >
      <img
        alt={alt}
        crossOrigin={crossOrigin}
        height={sideways ? 300 : 420}
        loading={lazy ? "lazy" : undefined}
        src={url}
        width={sideways ? 420 : 300}
      />
    </div>
  );
}
