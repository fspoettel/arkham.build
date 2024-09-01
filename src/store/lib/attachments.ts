import type { AttachmentQuantities } from "../slices/deck-edits.types";

export function clampAttachmentQuantity(
  edits: AttachmentQuantities | undefined,
  attachments: AttachmentQuantities,
  code: string,
  inDeck: number,
) {
  const next = structuredClone(edits ?? {});

  let totalCount = 0;

  for (const [targetCode, entries] of Object.entries(attachments)) {
    for (const [attachmentCode, quantity] of Object.entries(entries)) {
      if (attachmentCode === code) {
        if (quantity + totalCount >= inDeck) {
          const attached = Math.max(0, inDeck - totalCount);
          totalCount += attached;
          next[targetCode] ??= {};
          next[targetCode][attachmentCode] = attached;
        } else {
          totalCount += quantity;
        }
      }
    }
  }

  return next;
}
