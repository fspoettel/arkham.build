import type { AttachableDefinition } from "@/utils/constants";
import { Lightbulb, Package, Store, WandSparkles } from "lucide-react";
import { useMemo } from "react";

import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { Button } from "../ui/button";
import css from "./attachments.module.css";
import { canAttach, canUpdateAttachment, getAttachedQuantity } from "./utils";
import { useAttachmentsChangeHandler } from "./utils";

type Props = {
  card: Card;
  resolvedDeck: ResolvedDeck;
};

export function Attachments(props: Props) {
  const { card, resolvedDeck } = props;

  const matches = useMemo(
    () =>
      resolvedDeck.availableAttachments.filter((definition) =>
        canAttach(card, definition),
      ),
    [resolvedDeck.availableAttachments, card],
  );

  if (!matches.length) return null;

  return (
    <ul className={css["attachments"]}>
      {matches.map((definition) => {
        return (
          <Attachment
            card={card}
            definition={definition}
            resolvedDeck={resolvedDeck}
            key={definition.code}
          />
        );
      })}
    </ul>
  );
}

function Attachment(
  props: Props & {
    definition: AttachableDefinition;
  },
) {
  const { card, definition, resolvedDeck } = props;

  const onChangeAttachmentQuantity = useAttachmentsChangeHandler();

  const attached = getAttachedQuantity(card, definition, resolvedDeck);

  const contentNode = (
    <span className={css["attachment-content"]}>
      <AttachmentIcon name={definition.icon} />
      {!!attached && (
        <span className={css["attachment-quantity"]}>×{attached}</span>
      )}
    </span>
  );

  const canEdit =
    !!onChangeAttachmentQuantity &&
    canUpdateAttachment(card, definition, resolvedDeck);

  const onChangeQuantity = (delta: number) => {
    return onChangeAttachmentQuantity?.(definition, card, delta);
  };

  const onClick = () => {
    onChangeQuantity(1);
  };

  const onRightClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    onChangeQuantity(-1);
  };

  return (
    <li className={css["attachment"]} key={definition.code}>
      <Button
        iconOnly
        data-testid={`attachment-${definition.code}`}
        onClick={canEdit ? onClick : undefined}
        onContextMenu={canEdit ? onRightClick : undefined}
        size="sm"
        variant={!canEdit && !attached ? "bare" : undefined}
        tooltip={
          canEdit
            ? `Add to ${definition.name}`
            : `${attached > 0 ? "Attached to" : "Eligible for"} ${definition.name}`
        }
      >
        {contentNode}
      </Button>
    </li>
  );
}

export function AttachmentIcon(props: { name: string }) {
  const { name } = props;

  if (name === "lightbulb") {
    return <Lightbulb />;
  }

  if (name === "store") {
    return <Store />;
  }

  if (name === "wand-sparkles") {
    return <WandSparkles />;
  }

  if (name === "package") {
    return <Package />;
  }

  return null;
}
