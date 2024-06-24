import clsx from "clsx";

import { parseCardTextHtml } from "@/utils/card-utils";

import css from "./card.module.css";

type Props = {
  flavor?: string;
  isFlavorCardText?: boolean;
  size: "full" | "compact" | "tooltip";
  text?: string;
  tabooText?: string;
  tabooXp?: number;
  typeCode: string;
  victory?: number;
};

export function CardText({
  flavor,
  size,
  tabooText,
  tabooXp,
  text,
  typeCode,
  victory,
}: Props) {
  const isFlavorSwapped = ["agenda", "act", "story"].includes(typeCode);
  const isFlavorCardText = isFlavorSwapped || typeCode === "location";
  const showFlavor = size === "full" || isFlavorCardText;

  const textNode = text ? (
    <>
      <div className={css["text"]}>
        {text && (
          <p
            // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from trusted source.
            dangerouslySetInnerHTML={{
              __html: parseCardTextHtml(text),
            }}
          />
        )}
        {!!victory && (
          <p>
            <b>Victory {victory}.</b>
          </p>
        )}
      </div>
      {(tabooText || tabooXp != null) && (
        <div className={clsx("border-taboo", css["text"])}>
          {tabooText && (
            <p>
              <i className="icon-tablet color-taboo icon-text" /> Taboo List{" "}
              <br />
              Mutated
            </p>
          )}
          {!!tabooXp && (
            <p>
              <i className="icon-tablet color-taboo icon-text" /> Costs{" "}
              {tabooXp}
              {tabooXp > 0 ? " additional" : ""} experience.
            </p>
          )}
        </div>
      )}
    </>
  ) : null;

  const flavorNode =
    showFlavor && flavor ? (
      <div className={css["flavor"]}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from trusted source. */}
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
