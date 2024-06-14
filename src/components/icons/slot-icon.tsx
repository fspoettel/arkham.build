import SvgAccessory from "@/assets/icons/accessory_inverted.svg?react";
import SvgAlly from "@/assets/icons/ally_inverted.svg?react";
import SvgArcane from "@/assets/icons/arcane_inverted.svg?react";
import SvgArcane2 from "@/assets/icons/arcane_x2_inverted.svg?react";
import SvgBody from "@/assets/icons/body_inverted.svg?react";
import SvgHand from "@/assets/icons/hand_inverted.svg?react";
import SvgHand2 from "@/assets/icons/hand_x2_inverted.svg?react";
import SvgTarot from "@/assets/icons/tarot_inverted.svg?react";
import memoize from "@/utils/memoize";

export type Props = {
  className?: string;
  code: string;
};

const getIcon = memoize((code: string) => {
  switch (code) {
    case "Hand":
      return SvgHand;
    case "Hand x2":
      return SvgHand2;
    case "Accessory":
      return SvgAccessory;
    case "Ally":
      return SvgAlly;
    case "Arcane":
      return SvgArcane;
    case "Arcane x2":
      return SvgArcane2;
    case "Body":
      return SvgBody;
    case "Tarot":
      return SvgTarot;
    default:
      return null;
  }
});

function SlotIcon({ className, code }: Props) {
  const Icon = getIcon(code);
  return Icon ? <Icon className={className} /> : null;
}

export default SlotIcon;
