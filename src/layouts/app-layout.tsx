import { Footer } from "@/components/footer";
import { Masthead } from "@/components/masthead";
import { cx } from "@/utils/cx";
import { useDocumentTitle } from "@/utils/use-document-title";
import css from "./app-layout.module.css";

type Props = {
  children: React.ReactNode;
  mainClassName?: string;
  title: string;
};

export function AppLayout(props: Props) {
  const { children, mainClassName, title } = props;

  useDocumentTitle(title);

  return (
    <div className={cx(css["layout"], "fade-in")} data-testid="app-layout">
      <Masthead className={css["header"]} />
      <section className={cx(css["main"], mainClassName)}>{children}</section>
      <footer className={css["footer"]}>
        <Footer />
      </footer>
    </div>
  );
}
