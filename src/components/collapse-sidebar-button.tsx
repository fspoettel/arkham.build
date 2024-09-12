import { cx } from "@/utils/cx";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import css from "./collapse-sidebar-button.module.css";
import { Button } from "./ui/button";

type Props = {
  className?: string;
  orientation?: "left" | "right";
  callback: () => void;
};

export function CollapseSidebarButton(props: Props) {
  const { className, orientation = "left", callback } = props;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={cx(css["container"], css[orientation], className)}
      onClick={callback}
    >
      <Button
        as="button"
        data-testid="sidebar-collapse-button"
        tooltip="Collapse sidebar"
        onClick={callback}
        variant="round"
        iconOnly
        className={css["button"]}
      >
        {orientation === "left" ? <ChevronsLeft /> : <ChevronsRight />}
      </Button>
    </div>
  );
}
