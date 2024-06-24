import clsx from "clsx";

import type { ResolvedCard } from "@/store/lib/types";
import { getCardColor, parseCardTextHtml } from "@/utils/card-utils";

import css from "./customizations.module.css";

type Props = {
  card: ResolvedCard["card"];
};

export function Customizations({ card }: Props) {
  const backgroundCls = getCardColor(card, "background");

  const html = parseCardTextHtml(card.real_customization_text as string);

  return (
    <article className={css["customizations"]}>
      <header className={clsx(css["header"], backgroundCls)}>
        <h3>Customizations</h3>
      </header>
      <div className={css["text"]}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from trusted source. */}
        <p dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
