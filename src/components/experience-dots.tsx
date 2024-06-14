import { range } from "@/utils/range";

type Props = {
  className?: string;
  xp: number;
};

export function ExperienceDots({ className, xp }: Props) {
  const negative = xp < 0;
  return (
    <span className={className}>
      {range(0, Math.abs(xp)).map(() => (negative ? "-" : "•"))}
    </span>
  );
}
