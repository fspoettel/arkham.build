import { cx } from "@/utils/cx";

import { useMemo } from "react";
import css from "../icons/skill-icon-fancy.module.css";

type Props = {
  text?: string;
  x?: number;
  y?: number;
};

export function SkillIconLabel(props: Props) {
  const { text, x, y } = props;
  const skillName = useMemo(() => text?.replace("skill_", ""), [text]);

  console.log(props);
  return (
    <foreignObject x={x} y={y} width={50} height={50}>
      <span className={cx(css["icon"], css[skillName || ""], "pepe")}>
        <i className={`icon-skill_${skillName}`} />
        <i
          className={cx(`icon-skill_${skillName}_inverted`, css["inverted"])}
        />
      </span>
    </foreignObject>
  );
}
