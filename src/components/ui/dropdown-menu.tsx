import { cx } from "@/utils/cx";
import css from "./dropdown-menu.module.css";

type Props = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function DropdownMenu(props: Props) {
  const { children, className, ...rest } = props;
  return (
    <nav {...rest} className={cx(css["dropdown"], className)}>
      {children}
    </nav>
  );
}

export function DropdownMenuSection(props: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const { children, className, title } = props;

  return (
    <section className={cx(css["section"], className)}>
      <header className={css["header"]}>
        <h4 className={css["title"]}>{title}</h4>
      </header>
      <div className={css["content"]}>{children}</div>
    </section>
  );
}
