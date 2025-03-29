import { ListLayoutContextProvider } from "@/layouts/list-layout-context-provider";
import { ListLayoutNoSidebar } from "@/layouts/list-layout-no-sidebar";
import { useStore } from "@/store";
import { selectMetadata } from "@/store/selectors/shared";
import type { Card } from "@/store/services/queries.types";
import { displayAttribute } from "@/utils/card-utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { Error404 } from "../errors/404";

type Props = {
  code: string;
};

function UsableCards() {
  const params = useParams<Props>();

  const card = useStore((state) => selectMetadata(state).cards[params.code]);

  if (!card || card.type_code !== "investigator") {
    return <Error404 />;
  }

  return <UsableCardsList card={card} />;
}

function UsableCardsList(props: { card: Card }) {
  const { card } = props;
  const listKey = `investigator_usable_${card.code}`;
  const { t } = useTranslation();

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

  const title = t("card_view.actions.usable_by", {
    prefix: card.parallel ? `${t("common.parallel")} ` : "",
    name: displayAttribute(card, "name"),
  });

  return (
    <ListLayoutContextProvider>
      <ListLayoutNoSidebar titleString={title} title={title} />
    </ListLayoutContextProvider>
  );
}

export default UsableCards;
