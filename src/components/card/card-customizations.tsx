import clsx from "clsx";

import { CardResolved } from "@/store/selectors/card-detail";
import { getCardColor } from "@/utils/card-utils";

import css from "./card-customizations.module.css";

import { parseCustomizationTextHtml } from "./utils";

type Props = {
  card: CardResolved["card"];
};

export function CardCustomizations({ card }: Props) {
  const backgroundCls = getCardColor(card, "background");

  const html = parseCustomizationTextHtml(
    card.real_customization_text as string,
  );

  return (
    <article className={css["customizations"]}>
      <header className={clsx(css["header"], backgroundCls)}>
        <h3 className={css["header-title"]}>Customizations</h3>
      </header>
      <div className={css["customizations-text"]}>
        <p dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
