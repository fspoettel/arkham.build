import { ListLayoutNoSidebar } from "@/layouts/list-layout-no-sidebar";
import { useStore } from "@/store";
import type { Card } from "@/store/services/queries.types";
import { useEffect } from "react";
import { Redirect, useParams } from "wouter";

type Props = {
  code: string;
};

function UsableCards() {
  const params = useParams<Props>();

  const card = useStore((state) => state.metadata.cards[params.code]);

  if (!card || card.type_code !== "investigator") {
    return <Redirect to="/404" />;
  }

  return <UsableCardsList card={card} />;
}

function UsableCardsList(props: { card: Card }) {
  const { card } = props;
  const listKey = `investigator_usable_${card.code}`;

  const activeList = useStore((state) => state.lists[state.activeList ?? ""]);
  const addList = useStore((state) => state.addList);
  const setActiveList = useStore((state) => state.setActiveList);
  const removeList = useStore((state) => state.removeList);

  useEffect(() => {
    addList(listKey, "player", {
      investigator: card.code,
    });

    setActiveList(listKey);

    return () => {
      removeList(listKey);
      setActiveList(undefined);
    };
  }, [addList, removeList, setActiveList, listKey, card.code]);

  if (!activeList) return null;

  return (
    <ListLayoutNoSidebar
      titleString={`Cards usable by ${card.parallel ? "Parallel " : ""}${card.real_name}`}
      title={
        <>
          Cards usable by{" "}
          {card.parallel ? (
            <>
              <i className="icon-parallel" />{" "}
            </>
          ) : (
            ""
          )}
          {card.real_name}
        </>
      }
    />
  );
}

export default UsableCards;
