import { ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { MouseEvent, useCallback, useMemo, useState } from "react";

import { CardWithRelations } from "@/store/selectors/card-view";
import { queryFaq } from "@/store/services/queries";
import { useQuery } from "@/utils/use-query";

import css from "./faq.module.css";

import { Button } from "../ui/button";

type Props = {
  card: CardWithRelations["card"];
};

export function Faq({ card }: Props) {
  const [open, setOpen] = useState(false);

  const query = useMemo(
    () => (open ? () => queryFaq(card.code) : undefined),
    [card.code, open],
  );

  const response = useQuery(query);

  const redirectRelativeLinks = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      evt.preventDefault();
      if (evt.target instanceof HTMLAnchorElement) {
        // Redirect relative links to another domain
        const href = evt.target.getAttribute("href");
        if (href && href.startsWith("/")) {
          window.open(`https://arkhamdb.com${href}`, "_blank");
        }
      }
    },
    [],
  );

  return (
    <details className={css["sidebar-faq"]}>
      <Button as="summary" size="full" onClick={() => setOpen((p) => !p)}>
        {open ? <ChevronDownIcon /> : <span>?</span>} View FAQs
      </Button>

      <div
        className={clsx(css["sidebar-faq-content"], "icon-text-container")}
        onClick={redirectRelativeLinks}
      >
        {response.loading && "Loading..."}

        {!!response.error && "Error loading FAQ entries."}

        {response.data?.length === 0 && "No FAQ entries."}

        {!!response.data?.length &&
          response.data.map((faq, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: faq.html }} />
          ))}
      </div>
    </details>
  );
}
