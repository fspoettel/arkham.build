import { cx } from "@/utils/cx";

import type { ResolvedCard } from "@/store/lib/types";
import { getCardColor, parseCardTextHtml } from "@/utils/card-utils";

import css from "./customizations.module.css";

type Props = {
  card: ResolvedCard["card"];
};

export function Customizations(props: Props) {
  const backgroundCls = getCardColor(props.card, "background");

  const html = parseCardTextHtml(props.card.real_customization_text as string);

  return (
    <article className={css["customizations"]}>
      <header className={cx(css["header"], backgroundCls)}>
        <h3>Customizations</h3>
      </header>
      <div className={css["text"]}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from trusted source. */}
        <p dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
