import { cx } from "@/utils/cx";
import css from "./decklist-section.module.css";

type Props = {
  children: React.ReactNode;
  columns?: "single" | "auto" | "scans";
  showTitle?: boolean;
  title: string;
};

export function DecklistSection(props: Props) {
  const { children, columns = "auto", showTitle, title } = props;
  return (
    <article className={cx(css["decklist-section"], css[columns])}>
      <header className={css["decklist-section-header"]}>
        <h3
          className={cx(css["decklist-section-title"], !showTitle && "sr-only")}
        >
          {title}
        </h3>
      </header>
      <div className={css["decklist-section-content"]}>{children}</div>
    </article>
  );
}
