import css from "./card-text.module.css";

import { parseCardTextHtml } from "./utils";

type Props = {
  text?: string;
  victory?: number;
};

export function CardText({ text, victory }: Props) {
  if (!text && !victory) return null;

  return (
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
  );
}
