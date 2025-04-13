import { cx } from "@/utils/cx";
import css from "./decklist-section.module.css";

type Props = {
  children: React.ReactNode;
  columns?: "single" | "auto" | "scans";
  showTitle?: boolean;
  title: string;
  extraInfos?: string;
};

export function DecklistSection(props: Props) {
  const { children, columns = "auto", showTitle, title, extraInfos } = props;
  return (
    <article className={cx(css["decklist-section"], css[columns])}>
      <header className={css["decklist-section-header"]}>
        <h3
          className={cx(css["decklist-section-title"], !showTitle && "sr-only")}
        >
          {title}
          {extraInfos && (
            <span className={cx(css["decklist-section-extra-infos"])}>
              ({extraInfos})
            </span>
          )}
        </h3>
      </header>
      <div className={css["decklist-section-content"]}>{children}</div>
    </article>
  );
}
