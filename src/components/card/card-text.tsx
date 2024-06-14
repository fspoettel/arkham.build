import css from "./card-text.module.css";

import { parseCardTextHtml } from "./utils";

type Props = {
  text?: string;
  flavor?: string;
  isFlavorCardText?: boolean;
  victory?: number;
  typeCode: string;
  size: "full" | "compact" | "tooltip";
};

export function CardText({ flavor, size, text, typeCode, victory }: Props) {
  const isFlavorSwapped = ["agenda", "act", "story"].includes(typeCode);
  const isFlavorCardText = isFlavorSwapped || typeCode === "location";
  const showFlavor = size === "full" || isFlavorCardText;

  const textNode = text ? (
    <div className={css["text"]}>
      {text && (
        <p
          dangerouslySetInnerHTML={{
            __html: parseCardTextHtml(text),
          }}
        />
      )}
      {victory && (
        <p>
          <b>Victory {victory}.</b>
        </p>
      )}
    </div>
  ) : null;

  const flavorNode =
    showFlavor && flavor ? (
      <div className={css["flavor"]}>
        <p dangerouslySetInnerHTML={{ __html: parseCardTextHtml(flavor) }} />
      </div>
    ) : null;

  if (!flavorNode && !textNode) return null;

  return isFlavorSwapped ? (
    <>
      {flavorNode}
      {textNode}
    </>
  ) : (
    <>
      {textNode}
      {flavorNode}
    </>
  );
}
