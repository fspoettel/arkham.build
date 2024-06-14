export type Props = {
  code: string;
};

const getIcon = (code: string) => {
  switch (code) {
    case "Hand":
      return <i className="slots-hand_inverted" />;
    case "Hand x2":
      return <i className="slots-hand_x2_inverted" />;
    case "Accessory":
      return <i className="slots-accessory_inverted" />;
    case "Ally":
      return <i className="slots-ally_inverted" />;
    case "Arcane":
      return <i className="slots-arcane_inverted" />;
    case "Arcane x2":
      return <i className="slots-arcane_x2_inverted" />;
    case "Body":
      return <i className="slots-body_inverted" />;
    case "Tarot":
      return <i className="slots-tarot_inverted" />;
    default:
      return null;
  }
};

function SlotIcon({ code }: Props) {
  const Icon = getIcon(code);
  return Icon ? Icon : null;
}

export default SlotIcon;
