import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { cx } from "@/utils/cx";

import { CardListContainer } from "@/components/card-list/card-list-container";
import { Filters } from "@/components/filters/filters";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/utils/use-document-title";
import { useGoBack } from "@/utils/use-go-back";
import { ChevronLeft, Filter } from "lucide-react";
import { useCallback, useState } from "react";
import css from "./list-layout-no-sidebar.module.css";

type Props = {
  titleString: string;
  title?: React.ReactNode;
} & React.ComponentProps<typeof CardListContainer>;

export function ListLayoutNoSidebar(props: Props) {
  const { title, titleString, ...rest } = props;

  const [filtersOpen, onToggleFilters] = useState(false);

  useDocumentTitle(titleString);

  const goBack = useGoBack();

  const onContentClick = useCallback(
    (evt: React.PointerEvent) => {
      if (!filtersOpen) return;
      evt.preventDefault();
      onToggleFilters(false);
    },
    [filtersOpen],
  );

  return (
    <CardModalProvider>
      <div
        className={cx(
          css["layout"],
          filtersOpen && css["filters-open"],
          "fade-in",
        )}
        onPointerDown={onContentClick}
      >
        <Masthead className={css["masthead"]}>
          <Button onClick={goBack} variant="bare">
            <ChevronLeft /> Back
          </Button>
        </Masthead>
        <main className={css["content"]}>
          <header className={css["header"]}>
            <h1 className={css["title"]}>{title ?? titleString}</h1>
          </header>
          <CardListContainer
            {...rest}
            slotRight={
              <Button
                className={css["toggle-filters"]}
                onClick={() => onToggleFilters(true)}
              >
                <Filter />
              </Button>
            }
          />
        </main>
        <nav
          className={css["filters"]}
          data-state={filtersOpen ? "open" : "closed"}
        >
          <Filters />
        </nav>
      </div>
    </CardModalProvider>
  );
}
