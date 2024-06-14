import clsx from "clsx";

type Props = {
  className?: string;
  code: string;
};

const getIconFancy = (code: string) => {
  switch (code) {
    case "guardian": {
      return "icon-class_guardian";
    }

    case "mystic": {
      return "icon-class_mystic";
    }

    case "seeker": {
      return "icon-class_seeker";
    }

    case "rogue": {
      return "icon-class_rogue";
    }

    case "neutral": {
      return "icon-class_neutral";
    }

    case "multiclass": {
      return "icon-multiclass";
    }

    case "survivor": {
      return "icon-class_survivor";
    }

    case "mythos": {
      return "icon-auto_fail";
    }

    default: {
      return null;
    }
  }
};

export function FactionIconFancy({ className, code }: Props) {
  const iconCls = getIconFancy(code);
  return iconCls ? <i className={clsx(className, iconCls)} /> : null;
}
