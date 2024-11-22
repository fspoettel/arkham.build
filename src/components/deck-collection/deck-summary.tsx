import type { DeckValidationResult } from "@/store/lib/deck-validation";
import { extendedDeckTags } from "@/store/lib/resolve-deck";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Id } from "@/store/slices/data.types";
import { getCardColor } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import {
  CircleAlertIcon,
  CopyIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { CardThumbnail } from "../card-thumbnail";
import { DeckStats } from "../deck-stats";
import { DeckTags } from "../deck-tags";
import { Button } from "../ui/button";
import { DefaultTooltip } from "../ui/tooltip";
import css from "./deck-summary.module.css";

type Props = {
  deck: ResolvedDeck;
  onDeleteDeck?: (id: Id) => Promise<void>;
  onDuplicateDeck?: (id: Id) => void;
  interactive?: boolean;
  showThumbnail?: boolean;
  validation?: DeckValidationResult | string | null;
};

export function DeckSummary(props: Props) {
  const {
    deck,
    interactive,
    onDeleteDeck,
    onDuplicateDeck,
    showThumbnail,
    validation,
  } = props;

  const [, navigate] = useLocation();

  const backgroundCls = getCardColor(deck.investigatorBack.card, "background");
  const borderCls = getCardColor(deck.investigatorBack.card, "border");

  const card = {
    ...deck.investigatorFront.card,
    parallel:
      deck.investigatorFront.card.parallel ||
      deck.investigatorBack.card.parallel,
  };

  const onDuplicate = useCallback(
    (evt: React.MouseEvent) => {
      cancelEvent(evt);
      onDuplicateDeck?.(deck.id);
    },
    [deck.id, onDuplicateDeck],
  );

  const onDelete = useCallback(
    (evt: React.MouseEvent) => {
      cancelEvent(evt);
      onDeleteDeck?.(deck.id);
    },
    [deck.id, onDeleteDeck],
  );

  const onEdit = useCallback(
    (evt: React.MouseEvent) => {
      cancelEvent(evt);
      navigate(`/deck/edit/${deck.id}`);
    },
    [deck.id, navigate],
  );

  const onUpgrade = useCallback(
    (evt: React.MouseEvent) => {
      cancelEvent(evt);
      navigate(`/deck/view/${deck.id}?upgrade`);
    },
    [deck.id, navigate],
  );

  const renderTag = useCallback((tag: string) => {
    if (tag === "ArkhamDB") {
      return (
        <>
          <i className="icon-elder_sign" />
          <span>{tag}</span>
        </>
      );
    }

    return tag;
  }, []);

  const tags = useMemo(() => extendedDeckTags(deck, true), [deck]);

  return (
    <article
      className={cx(
        css["summary"],
        borderCls,
        interactive && css["interactive"],
      )}
    >
      <header className={cx(css["header"], backgroundCls)}>
        {showThumbnail && (
          <div className={css["thumbnail"]}>
            <CardThumbnail card={card} />
            {!!validation &&
              (typeof validation === "string" || !validation?.valid) && (
                <div className={css["validation"]}>
                  <CircleAlertIcon />
                </div>
              )}
          </div>
        )}
        <div className={css["header-container"]}>
          <div className={cx(css["info-container"])}>
            <h3 className={css["title"]} data-testid="deck-summary-title">
              {deck.name}
            </h3>
            <div className={cx(css["header-row"], css["wrap"])}>
              <div className={css["header-row"]}>
                {card.parallel && (
                  <DefaultTooltip tooltip="Uses a parallel side">
                    <i className="icon-parallel" />
                  </DefaultTooltip>
                )}
                <h4
                  className={css["sub"]}
                  data-testid="deck-summary-investigator"
                >
                  {card.real_name}
                </h4>
              </div>
              <DeckStats deck={deck} />
            </div>
          </div>

          <nav
            className={cx(css["quick-actions-list"], css["summary-transition"])}
          >
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Edit"
              onClick={onEdit}
            >
              <PencilIcon />
            </Button>
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Upgrade"
              onClick={onUpgrade}
            >
              <i className="icon-xp-bold" />
            </Button>
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Duplicate"
              onClick={onDuplicate}
            >
              <CopyIcon />
            </Button>
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Delete"
              onClick={onDelete}
            >
              <Trash2Icon />
            </Button>
          </nav>
        </div>
      </header>
      <div className={css["meta"]}>
        <DeckTags renderTag={renderTag} tags={tags} />
      </div>
    </article>
  );
}

function cancelEvent(evt: React.MouseEvent) {
  evt.preventDefault();
  evt.stopPropagation();
}
