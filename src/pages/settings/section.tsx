import css from "./settings.module.css";

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export function Section(p: Props) {
  return (
    <section className={css["section"]}>
      <header className={css["section-header"]}>
        <h2 className={css["section-title"]}>{p.title}</h2>
      </header>
      <div className={css["section-content"]}>{p.children}</div>
    </section>
  );
}
