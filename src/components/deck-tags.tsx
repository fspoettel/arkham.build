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
    <ul className={css["tags"]}>
      {tagList.map((s, i) => (
        <Tag as="li" key={i} size="xs">
          {capitalize(s).trim()}
        </Tag>
      ))}
    </ul>
  );
}
