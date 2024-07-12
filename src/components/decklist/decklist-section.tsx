import clsx from "clsx";

import css from "./decklist-section.module.css";

type Props = {
  children: React.ReactNode;
  showTitle?: boolean;
  title: string;
};

export function DecklistSection(props: Props) {
  const { children, showTitle, title } = props;
  return (
    <article className={clsx(css["decklist-section"])}>
      <header className={css["decklist-section-header"]}>
        <h3
          className={clsx(
            css["decklist-section-title"],
            !showTitle && "sr-only",
          )}
        >
          {title}
        </h3>
      </header>
      <div className={css["decklist-section-content"]}>{children}</div>
    </article>
  );
}
