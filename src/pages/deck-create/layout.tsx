import clsx from "clsx";

import { Footer } from "@/components/footer";
import { Masthead } from "@/components/masthead";

import css from "./deck-create.module.css";

type Props = {
  children: React.ReactNode;
  mastheadContent?: React.ReactNode;
  selections: React.ReactNode;
  sidebar: React.ReactNode;
};

export function Layout({
  children,
  mastheadContent,
  selections,
  sidebar,
}: Props) {
  return (
    <div className={clsx(css["layout"], "fade-in")}>
      <Masthead className={css["layout-header"]}>{mastheadContent}</Masthead>
      <div className={css["layout-sidebar"]}>{sidebar}</div>
      <div className={css["layout-content"]}>{children}</div>
      <div className={css["layout-selections"]}>{selections}</div>
      <footer className={css["layout-footer"]}>
        <Footer />
      </footer>
    </div>
  );
}
