import type { Card } from "@arkham-build/shared";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { deckCreateLink, displayAttribute } from "@/utils/card-utils";
import { useAccentColor } from "@/utils/use-accent-color";
import css from "./choose-investigator-link.module.css";
import { Button } from "./ui/button";

export function ChooseInvestigatorLink(props: {
  card: Card;
  sealedDeckId?: string;
}) {
  const { t } = useTranslation();
  const cssVariables = useAccentColor(props.card);

  return (
    <Link asChild to={deckCreateLink(props.card, props.sealedDeckId)}>
      <Button
        as="a"
        className={css["choose-investigator-button"]}
        data-testid="create-choose-investigator"
        iconOnly
        size="lg"
        style={cssVariables}
        tooltip={t("choose_investigator.create_tooltip", {
          name: displayAttribute(props.card, "name"),
        })}
        variant="primary"
      >
        <PlusIcon />
      </Button>
    </Link>
  );
}
