import css from "./card-flavor.module.css";

import { parseCardTextHtml } from "./utils";

type Props = {
  flavor?: string;
};

export function CardFlavor({ flavor }: Props) {
  if (!flavor) return null;
  return (
    <div className={css["flavor"]}>
      <p dangerouslySetInnerHTML={{ __html: parseCardTextHtml(flavor) }} />
    </div>
  );
}
