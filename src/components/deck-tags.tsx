import { capitalizeWords, formatProviderName } from "@/utils/formatting";
import { LockKeyholeIcon, ShareIcon } from "lucide-react";
import css from "./deck-tags.module.css";
import { Tag } from "./ui/tag";

type Props = {
  tags: string[];
};

const tagRenderer = (tag: string) => {
  let icon = null;

  if (tag === "arkhamdb") {
    icon = <i className="icon-elder_sign" />;
  } else if (tag === "private") {
    icon = <LockKeyholeIcon />;
  } else if (tag === "shared") {
    icon = <ShareIcon />;
  }

  const str = tag.trim();

  return (
    <>
      {icon}
      <span>
        {tag === "arkhamdb" ? formatProviderName(str) : capitalizeWords(str)}
      </span>
    </>
  );
};

export function DeckTags(props: Props) {
  const { tags } = props;

  if (!tags.length) return null;

  return (
    <ul className={css["tags"]} data-testid="deck-tags">
      {tags.map((s, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
        <Tag as="li" key={i} size="xs">
          {tagRenderer(s)}
        </Tag>
      ))}
    </ul>
  );
}
