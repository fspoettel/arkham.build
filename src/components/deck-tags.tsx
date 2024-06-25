import { capitalize } from "@/utils/formatting";

import css from "./deck-tags.module.css";

import { Tag } from "./ui/tag";

type Props = {
  tags: string;
};

export function DeckTags({ tags }: Props) {
  const trimmed = tags.trim();
  if (!trimmed.length) return null;

  const tagList = trimmed.split(" ");

  return (
    <ul className={css["tags"]} data-testid="deck-tags">
      {tagList.map((s, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
        <Tag as="li" key={i} size="xs">
          {capitalize(s).trim()}
        </Tag>
      ))}
    </ul>
  );
}
