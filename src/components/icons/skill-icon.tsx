import clsx from "clsx";

type Props = {
  className?: string;
  skill: string;
};

export function SkillIcon({ className, skill }: Props) {
  return skill ? <i className={clsx(`icon-${skill}`, className)} /> : null;
}
