import { capitalize } from "@/utils/formatting";
import css from "./deck-tags.module.css";
import { Tag } from "./ui/tag";

type Props = {
  children?: React.ReactNode;
  tags: string;
};

export function DeckTags(props: Props) {
  const { children, tags } = props;

  const trimmed = tags.trim();
  if (!children && !trimmed.length) return null;

  const tagList = trimmed.length ? trimmed.split(" ") : [];

  return (
    <ul className={css["tags"]} data-testid="deck-tags">
      {children}
      {tagList.map((s, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
        <Tag as="li" key={i} size="xs">
          {capitalize(s).trim()}
        </Tag>
      ))}
    </ul>
  );
}
