import { CollectionSettings } from "@/components/collection/collection";
import { AppLayout } from "@/layouts/app-layout";
import { useStore } from "@/store";
import { selectTotalOwned } from "@/store/selectors/collection";
import { selectSettings } from "@/store/selectors/settings";
import { cx } from "@/utils/cx";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "wouter";
import css from "./collection-stats.module.css";

function CollectionStats() {
  const { t } = useTranslation();
  const settings = useStore(selectSettings);

  const ownedCount = useStore(selectTotalOwned);

  return (
    <AppLayout title="Collection Stats">
      <div className={cx(css["layout"])}>
        <h1 className={css["title"]}>{t("collection_stats.title")}</h1>
        <div className={cx(css["content"], "longform")}>
          <p>
            <Trans
              i18nKey="collection_stats.description"
              t={t}
              components={{ custom_link: <Link href="/settings" /> }}
            >
              This page displays your collection and card counts based on your
              collection settings. To update your collection settings, visit the{" "}
              <Link href="/settings">Settings</Link> page.
            </Trans>
          </p>
          <blockquote>
            <Trans
              i18nKey="collection_stats.counts"
              t={t}
              values={{
                player_count: ownedCount.player,
                encounter_count: ownedCount.encounter,
              }}
              components={{ strong: <strong /> }}
            >
              You own <strong>{ownedCount.player}</strong> player and{" "}
              <strong>{ownedCount.encounter}</strong> encounter cards.
            </Trans>
          </blockquote>
        </div>
        <CollectionSettings canShowCounts settings={settings} />
      </div>
    </AppLayout>
  );
}

export default CollectionStats;
