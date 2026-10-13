import { LoaderCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCardLinkTooltip } from "@/components/card-tooltip/use-card-link-tooltip";
import { PlaneContainer } from "@/components/ui/plane-container";
import { Tag } from "@/components/ui/tag";
import { useCardFaqQuery } from "@/queries/grimoire";
import { resolveGrimoireHtmlReferences } from "@/utils/grimoire-markdown";
import { parseCardTextHtml } from "@/utils/card-utils";
import { parseMarkdown } from "@/utils/markdown";
import css from "./card-faq.module.css";

type Props = {
  className?: string;
  code: string;
  hideEmpty?: boolean;
};

export function CardFaq(props: Props) {
  const { className, code, hideEmpty } = props;
  const { t } = useTranslation();
  const faq = useCardFaqQuery(code);
  const { cardLinkTooltip, referenceProps } = useCardLinkTooltip();
  const faqMarkup = faq.data?.map((item) => ({
    ...item,
    questionMarkup: {
      __html: getCardFaqHtml(item.question, true),
    },
    rulingMarkup: {
      __html: getCardFaqHtml(item.ruling),
    },
  }));

  if (hideEmpty && (faq.isPending || faq.data?.length === 0)) {
    return null;
  }

  return (
    <PlaneContainer
      as="section"
      className={className}
      title={t("card_view.faq.title")}
    >
      {faq.isPending && (
        <output className={css["status"]}>
          <LoaderCircleIcon className="spin" />
        </output>
      )}

      {faq.error && (
        <output className={css["status"]}>{t("card_view.faq.error")}</output>
      )}

      {faq.data?.length === 0 && (
        <output className={css["status"]}>{t("card_view.faq.empty")}</output>
      )}

      {!!faqMarkup?.length && (
        <ul className={css["list"]} {...referenceProps}>
          {faqMarkup.map((item) => (
            <li key={item.id}>
              <div
                className={css["question"]}
                // oxlint-disable-next-line react/no-danger -- HTML is from trusted source.
                dangerouslySetInnerHTML={item.questionMarkup}
              />
              <div
                // oxlint-disable-next-line react/no-danger -- HTML is from trusted source.
                dangerouslySetInnerHTML={item.rulingMarkup}
              />
              <p>
                <Tag size="sm">{item.citation}</Tag>
              </p>
            </li>
          ))}
        </ul>
      )}

      {cardLinkTooltip}
    </PlaneContainer>
  );
}

function getCardFaqHtml(markdown: string, omitNewLines?: boolean) {
  return resolveGrimoireHtmlReferences(
    parseCardTextHtml(parseMarkdown(markdown), {
      newLines: omitNewLines ? "skip" : undefined,
    }),
  );
}
