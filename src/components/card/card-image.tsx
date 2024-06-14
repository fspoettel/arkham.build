import clsx from "clsx";

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
        src={`${import.meta.env.VITE_CARD_IMAGE_URL}/optimized/${code}.webp`}
        width={sideways ? 420 : 300}
        height={sideways ? 300 : 420}
      />
    </div>
  );
}
