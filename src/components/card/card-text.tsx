import { parseCardTextHtml } from "@/utils/card-utils";
import css from "./card.module.css";

type Props = {
  flavor?: string;
  size: "full" | "compact" | "tooltip";
  text?: string;
  typeCode: string;
  victory?: number;
};

export function CardText(props: Props) {
  const { flavor, size, text, typeCode, victory } = props;

  const swapFlavor = ["agenda", "act", "story"].includes(typeCode);

  const flavorIsCardText = swapFlavor || typeCode === "location";

  const showFlavor = flavorIsCardText || size === "full";

  const textNode = !!text && (
    <div className={css["text"]} data-testid="card-text">
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
  );

  const flavorNode = showFlavor && !!flavor && (
    <div className={css["flavor"]}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from trusted source. */}
      <p dangerouslySetInnerHTML={{ __html: parseCardTextHtml(flavor) }} />
    </div>
  );

  if (!flavorNode && !textNode) return null;

  return swapFlavor ? (
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
