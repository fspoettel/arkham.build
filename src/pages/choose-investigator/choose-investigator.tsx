import { Button } from "@/components/ui/button";
import { ListLayoutContextProvider } from "@/layouts/list-layout-context-provider";
import { ListLayoutNoSidebar } from "@/layouts/list-layout-no-sidebar";
import { useStore } from "@/store";
import type { CardWithRelations } from "@/store/lib/types";
import {
  selectActiveList,
  selectCardRelationsResolver,
} from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import { useAccentColor } from "@/utils/use-accent-color";
import { useDocumentTitle } from "@/utils/use-document-title";
import { CirclePlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import css from "./choose-investigator.module.css";
import { SignatureLink } from "./signature-link";

function DeckCreateChooseInvestigator() {
  const activeListId = useStore((state) => state.activeList);

  const setActiveList = useStore((state) => state.setActiveList);

  const cardResolver = useStore(selectCardRelationsResolver);

  const activeList = useStore(selectActiveList);

  useDocumentTitle("Choose investigator");

  useEffect(() => {
    setActiveList("create_deck");
  }, [setActiveList]);

  if (activeListId !== "create_deck") return null;

  return (
    <ListLayoutContextProvider>
      <ListLayoutNoSidebar
        renderCardAction={(card) => <ChooseInvestigatorLink card={card} />}
        renderCardMetaExtra={
          activeList?.display.viewMode === "compact"
            ? (card) => (
                <p className={css["traits"]}>&middot; {card.real_traits}</p>
              )
            : undefined
        }
        renderCardAfter={({ code }) => (
          <ListcardExtra code={code} cardResolver={cardResolver} />
        )}
        itemSize="investigator"
        titleString="Choose investigator"
      />
    </ListLayoutContextProvider>
  );
}

function ListcardExtra({
  cardResolver,
  code,
}: {
  cardResolver: (code: string) => CardWithRelations | undefined;
  code: string;
}) {
  const signaturesRef = useRef<HTMLUListElement>(null);

  const resolved = cardResolver(code);
  const signatures = resolved?.relations?.requiredCards;

  if (!signatures?.length) return null;

  return (
    <ul className={css["signatures"]} ref={signaturesRef}>
      {signatures.map(({ card }) => (
        <SignatureLink
          card={card}
          key={card.code}
          signaturesRef={signaturesRef}
        />
      ))}
    </ul>
  );
}

function ChooseInvestigatorLink(props: { card: Card }) {
  const cssVariables = useAccentColor(props.card.faction_code);

  return (
    <Link
      asChild
      to={
        props.card.parallel
          ? `/deck/create/${props.card.alternate_of_code}?initial_investigator=${props.card.code}`
          : `/deck/create/${props.card.code}`
      }
    >
      <Button
        as="a"
        className={css["choose-investigator-button"]}
        data-testid="create-choose-investigator"
        iconOnly
        variant="primary"
        size="lg"
        style={cssVariables}
        tooltip={`Create ${props.card.real_name} deck`}
      >
        <CirclePlusIcon />
      </Button>
    </Link>
  );
}

export default DeckCreateChooseInvestigator;
