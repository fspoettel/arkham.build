import clsx from "clsx";

type Props = {
  className?: string;
  level?: number;
  inverted?: boolean;
};

export function LevelIcon({ className, inverted, level }: Props) {
  const iconName = level == null ? "none" : level;

  return (
    <i
      className={clsx(
        className,
        inverted ? `icon-inverted_level_${iconName}` : `icon-level_${iconName}`,
        className,
      )}
    />
  );
}
