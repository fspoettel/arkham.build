import clsx from "clsx";

import { Footer } from "@/components/footer";
import { Masthead } from "@/components/masthead";

import css from "./layout.module.css";

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
    <div className={clsx(css["layout"])}>
      <Masthead className={css["header"]}>{mastheadContent}</Masthead>
      <div className={css["sidebar"]}>{sidebar}</div>
      <div className={css["content"]}>{children}</div>
      <div className={css["selections"]}>{selections}</div>
      <footer className={css["footer"]}>
        <Footer />
      </footer>
    </div>
  );
}
