import clsx from "clsx";

import { Footer } from "@/components/footer";
import { Masthead } from "@/components/masthead";
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
    <div className={clsx(css["layout"], "fade-in")}>
      <Masthead className={css["header"]} />
      <section className={clsx(css["main"], mainClassName)}>{children}</section>
      <footer className={css["footer"]}>
        <Footer />
      </footer>
    </div>
  );
}
