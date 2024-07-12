import clsx from "clsx";

import css from "./skill-icon-fancy.module.css";

type Props = {
  className?: string;
  skill: string;
};

export function SkillIconFancy(props: Props) {
  const { className, skill } = props;
  return (
    <span className={clsx(css["icon"], css[skill], className)}>
      <i className={`icon-skill_${skill}`} />
      <i className={clsx(`icon-skill_${skill}_inverted`, css["inverted"])} />
    </span>
  );
}
