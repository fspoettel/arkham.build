import { useStore } from "@/store";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import css from "./preview-banner.module.css";
import { Button } from "./ui/button";

const BANNER_ID = "preview-tdc";

export function PreviewBanner() {
  const settings = useStore((state) => state.settings);
  const { t } = useTranslation();

  const dismissed = useStore((state) =>
    state.app?.bannersDismissed?.includes(BANNER_ID),
  );

  const updateSettings = useStore((state) => state.updateSettings);
  const dismissBanner = useStore((state) => state.dismissBanner);

  const onDismiss = useCallback(() => {
    dismissBanner(BANNER_ID);
  }, [dismissBanner]);

  const onEnablePreviews = useCallback(() => {
    updateSettings({ ...settings, showPreviews: true });
    dismissBanner(BANNER_ID);
  }, [settings, updateSettings, dismissBanner]);

  if (settings.showPreviews || dismissed) {
    return null;
  }

  return (
    <article className={css["preview"]} data-testid="preview-banner">
      <div className={css["content"]}>
        <header className={css["header"]}>
          <h3 className={css["title"]}>
            <i className="encounters-tdcp" />
            {t("preview_banner.title")}
          </h3>
        </header>
        <p>{t("preview_banner.description")}</p>
        <div className={css["actions"]}>
          <Button
            size="sm"
            variant="primary"
            onClick={onEnablePreviews}
            data-testid="preview-banner-enable"
          >
            {t("preview_banner.actions.enable")}
          </Button>
          <Button
            size="sm"
            onClick={onDismiss}
            data-testid="preview-banner-dismiss"
          >
            {t("preview_banner.actions.dismiss")}
          </Button>
        </div>
      </div>
    </article>
  );
}
