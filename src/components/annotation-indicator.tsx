import { MessageCircleIcon } from "lucide-react";
import css from "./annotation-indicator.module.css";
import { DefaultTooltip } from "./ui/tooltip";

export function AnnotationIndicator() {
  return (
    <DefaultTooltip tooltip="Card has an annotation">
      <span
        className={css["annotation-icon"]}
        data-testid="annotation-indicator"
      >
        <MessageCircleIcon />
      </span>
    </DefaultTooltip>
  );
}
