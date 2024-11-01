import { CenterLayout } from "@/layouts/center-layout";
import { useStore } from "@/store";
import {
  selectActiveList,
  selectActiveListSearch,
  selectListCards,
} from "@/store/selectors/lists";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { Footer } from "../footer";
import { CardListNav } from "./card-list-nav";
import { CardSearch } from "./card-search";
import type { CardListProps } from "./types";

import { useCallback } from "react";
import { CardGrid } from "./card-grid";
import { CardList } from "./card-list";
import css from "./card-list-container.module.css";

export function CardListContainer(props: CardListProps) {
  const { className, slotLeft, slotRight, targetDeck, ...rest } = props;

  const ctx = useResolvedDeck();

  const search = useStore(selectActiveListSearch);
  const metadata = useStore((state) => state.metadata);
  const data = useStore((state) =>
    selectListCards(state, ctx.resolvedDeck, targetDeck),
  );

  const viewMode = useStore(
    (state) => selectActiveList(state)?.display?.viewMode ?? "compact",
  );
  const setListViewMode = useStore((state) => state.setListViewMode);

  const onSelectGroup = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const customEvent = new CustomEvent("list-select-group", {
        detail: evt.target.value,
      });
      window.dispatchEvent(customEvent);
    },
    [],
  );

  const onKeyboardNavigate = useCallback((evt: React.KeyboardEvent) => {
    if (
      evt.key === "ArrowDown" ||
      evt.key === "ArrowUp" ||
      evt.key === "Enter" ||
      evt.key === "Escape"
    ) {
      evt.preventDefault();

      const customEvent = new CustomEvent("list-keyboard-navigate", {
        detail: evt.key,
      });

      window.dispatchEvent(customEvent);

      if (evt.key === "Escape" && evt.target instanceof HTMLElement) {
        evt.target.blur();
      }
    }
  }, []);

  return (
    <CenterLayout
      className={className}
      top={
        <CardSearch
          onInputKeyDown={onKeyboardNavigate}
          slotLeft={slotLeft}
          slotRight={slotRight}
        />
      }
    >
      <div className={css["container"]}>
        <CardListNav
          deck={ctx.resolvedDeck}
          data={data}
          metadata={metadata}
          onSelectGroup={onSelectGroup}
          onViewModeChange={setListViewMode}
          viewMode={viewMode}
        />
        {data &&
          (viewMode === "scans" ? (
            <CardGrid
              {...rest}
              data={data}
              metadata={metadata}
              search={search}
              viewMode={viewMode}
            />
          ) : (
            <CardList
              {...rest}
              data={data}
              metadata={metadata}
              search={search}
              viewMode={viewMode}
            />
          ))}
        <Footer className={css["footer"]} />
      </div>
    </CenterLayout>
  );
}
