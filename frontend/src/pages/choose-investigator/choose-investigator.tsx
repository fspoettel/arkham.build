import type { Card } from "@arkham-build/shared";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CardModalProvider } from "@/components/card-modal/card-modal-provider";
import { ChooseInvestigatorLink } from "@/components/choose-investigator-link";
import { ListLayoutContextProvider } from "@/layouts/list-layout-context-provider";
import { ListLayoutNoSidebar } from "@/layouts/list-layout-no-sidebar";
import { useStore } from "@/store";
import type { CardWithRelations } from "@/store/lib/types";
import { selectCardRelationsResolver } from "@/store/selectors/lists";
import { selectActiveList } from "@/store/selectors/shared";
import { displayAttribute } from "@/utils/card-utils";
import css from "./choose-investigator.module.css";
import { SignatureLink } from "./signature-link";

function DeckCreateChooseInvestigator() {
  const { t } = useTranslation();
  const activeListId = useStore((state) => state.activeList);

  const setActiveList = useStore((state) => state.setActiveList);

  const cardResolver = useStore(selectCardRelationsResolver);

  const activeList = useStore(selectActiveList);

  useEffect(() => {
    setActiveList("create_deck");
  }, [setActiveList]);

  const getListCardProps = () => ({
    renderCardExtra: (card: Card) => <ChooseInvestigatorLink card={card} />,
    renderCardMetaExtra:
      activeList?.display.viewMode === "compact"
        ? (card: Card) => (
            <p className={css["traits"]}>
              &middot; {displayAttribute(card, "traits")}
            </p>
          )
        : undefined,
    renderCardAfter: (card: Card) => (
      <ListcardExtra code={card.code} cardResolver={cardResolver} />
    ),
    size: "investigator" as const,
  });

  if (activeListId !== "create_deck") return null;

  return (
    <CardModalProvider>
      <ListLayoutContextProvider>
        <ListLayoutNoSidebar
          getListCardProps={getListCardProps}
          titleString={t("choose_investigator.title")}
        />
      </ListLayoutContextProvider>
    </CardModalProvider>
  );
}

function ListcardExtra({
  cardResolver,
  code,
}: {
  cardResolver: (code: string) => CardWithRelations | undefined;
  code: string;
}) {
  const resolved = cardResolver(code);
  const signatures = resolved?.relations?.requiredCards;

  if (!signatures?.length) return null;

  return (
    <ul className={css["signatures"]}>
      {signatures.map(({ card }) => (
        <SignatureLink card={card} key={card.code} />
      ))}
    </ul>
  );
}

export default DeckCreateChooseInvestigator;
