import clsx from "clsx";

type Props = {
  className?: string;
  code: string;
};

export function FactionIcon({ className, code }: Props) {
  return <i className={clsx(className, `icon-layout icon-${code}`)} />;
}
