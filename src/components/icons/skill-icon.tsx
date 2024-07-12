import clsx from "clsx";

type Props = {
  className?: string;
  skill: string;
};

export function SkillIcon(props: Props) {
  return props.skill ? (
    <i className={clsx(`icon-${props.skill}`, props.className)} />
  ) : null;
}
