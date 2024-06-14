import clsx from "clsx";

import { imageUrl } from "@/utils/card-utils";

import css from "./card-image.module.css";

type Props = {
  code: string;
  className?: string;
  sideways?: boolean;
};

export function CardImage({ className, code, sideways }: Props) {
  return (
    <div className={clsx(css["image"], className)}>
      <img
        src={imageUrl(code)}
        width={sideways ? 420 : 300}
        height={sideways ? 300 : 420}
      />
    </div>
  );
}
