import clsx from "clsx";

type Props = {
  className?: string;
  code: string;
};

export function FactionIcon(props: Props) {
  return <i className={clsx(props.className, `icon-${props.code}`)} />;
}
