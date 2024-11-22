import { capitalize } from "@/utils/formatting";
import css from "./deck-tags.module.css";
import { Tag } from "./ui/tag";

type Props = {
  renderTag?: (tag: string) => React.ReactNode;
  tags: string[];
};

export function DeckTags(props: Props) {
  const { renderTag, tags } = props;

  if (!tags.length) return null;

  return (
    <ul className={css["tags"]} data-testid="deck-tags">
      {tags.map((s, i) => {
        const tagStr = capitalize(s).trim();
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
          <Tag as="li" key={i} size="xs">
            {renderTag ? renderTag(tagStr) : tagStr}
          </Tag>
        );
      })}
    </ul>
  );
}
