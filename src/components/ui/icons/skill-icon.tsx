import clsx from "clsx";

type Props = {
  className?: string;
  skill: string; // TODO: typecheck
};

export function SkillIcon({ className, skill }: Props) {
  return skill ? (
    <i className={clsx(`icon-layout icon-${skill}`, className)} />
  ) : null;
}
