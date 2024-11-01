import { Collection } from "@/components/collection/collection";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { selectTotalOwned } from "@/store/selectors/collection";
import { cx } from "@/utils/cx";
import { Link } from "wouter";
import css from "./collection-stats.module.css";

function CollectionStats() {
  const settings = useStore((state) => state.settings);

  const ownedCount = useStore(selectTotalOwned);

  return (
    <AppLayout title="Collection Stats">
      <div className={cx(css["layout"])}>
        <h1 className={css["title"]}>Collection Stats</h1>
        <div className={cx(css["content"], "longform")}>
          <p>
            This page displays your collection and card counts based on your
            collection settings. To update your collection settings, visit the{" "}
            <Link href="/settings">Settings</Link> page.
          </p>
          <blockquote>
            You own <strong>{ownedCount.player}</strong> player and{" "}
            <strong>{ownedCount.encounter}</strong> encounter cards.
          </blockquote>
        </div>
        <Collection canShowCounts settings={settings} />
      </div>
    </AppLayout>
  );
}

export default CollectionStats;
