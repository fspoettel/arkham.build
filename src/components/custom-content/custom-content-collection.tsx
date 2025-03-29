import { useStore } from "@/store";
import { selectOwnedCustomProjects } from "@/store/selectors/custom-content";
import { cx } from "@/utils/cx";
import { parseMarkdown } from "@/utils/markdown";
import { ExternalLinkIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { MediaCard } from "../ui/media-card";
import css from "./custom-content-collection.module.css";

export function CustomContentCollection() {
  const customProjects = useStore(selectOwnedCustomProjects);

  const { t } = useTranslation();

  console.log(customProjects);

  return (
    <section className={css["collection"]}>
      <header className={css["header"]}>
        <h2 className={css["title"]}>{t("custom_content.collection")}</h2>
      </header>
      <div className={css["projects"]}>
        {customProjects.map((project) => {
          const { meta } = project;

          return (
            <MediaCard
              className={css["project"]}
              key={meta.code}
              bannerAlt={meta.name}
              bannerUrl={meta.banner_url}
              title={<h3>{meta.name}</h3>}
            >
              <h4>{meta.author}</h4>

              <div className={cx(css["section"], "longform")}>
                {meta.description && (
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: escaped in parseMarkdown
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(meta.description),
                    }}
                  />
                )}
                {meta.external_link && (
                  <Button
                    as="a"
                    variant="link"
                    href={meta.external_link}
                    size="none"
                  >
                    {t("custom_content.view_external")}
                    <ExternalLinkIcon />
                  </Button>
                )}
              </div>

              <nav className={css["actions"]}>
                <Button iconOnly size="sm">
                  <EyeIcon /> View cards
                </Button>
                <Button iconOnly size="sm">
                  <Trash2Icon /> Remove
                </Button>
              </nav>
            </MediaCard>
          );
        })}
      </div>
    </section>
  );
}
