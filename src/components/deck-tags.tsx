import { capitalize } from "@/utils/formatting";

import css from "./deck-tags.module.css";

import { Tag } from "./ui/tag";

type Props = {
  tags: string;
};

export function DeckTags({ tags }: Props) {
  const tagList = tags.split(" ");
  if (!tagList.length) return null;

  return (
    <ul className={css["deck-tags"]}>
      {tagList.map((s, i) => (
        <Tag as="li" key={i} size="xs">
          {capitalize(s).trim()}
        </Tag>
      ))}
    </ul>
  );
}
