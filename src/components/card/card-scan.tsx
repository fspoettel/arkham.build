import clsx from "clsx";

import { imageUrl } from "@/utils/card-utils";

import css from "./card.module.css";

type Props = {
  code: string;
  className?: string;
  sideways?: boolean;
};

export function CardScan({ className, code, sideways }: Props) {
  return (
    <div className={clsx(css["scan"], className)}>
      <img
        height={sideways ? 300 : 420}
        src={imageUrl(code)}
        width={sideways ? 420 : 300}
      />
    </div>
  );
}
