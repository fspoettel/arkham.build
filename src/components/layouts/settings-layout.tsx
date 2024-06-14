import { ReactNode } from "react";

import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./settings-layout.module.css";

import { Masthead } from "./masthead";

type Props = {
  children?: ReactNode;
};

export function SettingsLayout({ children }: Props) {
  useDocumentTitle("Settings");
  return (
    <div className={css["layout"]}>
      <Masthead />
      <main className={css["layout-main"]}>{children}</main>
    </div>
  );
}
