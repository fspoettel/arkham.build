import { CirclePlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { selectCardRelationsResolver } from "@/store/selectors/card-list";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./choose-investigator.module.css";

import { ListLayoutNoSidebar } from "@/layouts/list-layout-no-sidebar";
import type { CardWithRelations } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { useAccentColor } from "@/utils/use-accent-color";
import { SignatureLink } from "./signature-link";

function DeckCreateChooseInvestigator() {
  const activeListId = useStore((state) => state.activeList);

  const setActiveList = useStore((state) => state.setActiveList);

  const cardResolver = useStore(selectCardRelationsResolver);

  useDocumentTitle("Choose investigator");

  useEffect(() => {
    setActiveList("create_deck");
  }, [setActiveList]);

  if (activeListId !== "create_deck") return null;

  return (
    <ListLayoutNoSidebar
      renderListCardAction={(card) => <ChooseInvestigatorLink card={card} />}
      renderListCardExtra={({ code }) => (
        <ListcardExtra code={code} cardResolver={cardResolver} />
      )}
      listcardSize="investigator"
      titleString="Choose investigator"
    />
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
    <Link asChild to={`/deck/create/${props.card.code}`}>
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
