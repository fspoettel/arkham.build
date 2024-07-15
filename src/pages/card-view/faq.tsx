import DOMPurify from "dompurify";
import { useMemo, useState } from "react";

import type { ResolvedCard } from "@/store/lib/types";
import { queryFaq } from "@/store/services/queries";
import { useQuery } from "@/utils/use-query";

import { Details } from "@/components/ui/details";
import { redirectArkhamDBLinks } from "@/utils/arkhamdb";

type Props = {
  card: ResolvedCard["card"];
};

export function Faq(props: Props) {
  const [open, setOpen] = useState(false);
  const { card } = props;

  const query = useMemo(
    () => (open ? () => queryFaq(card.code) : undefined),
    [card.code, open],
  );

  const response = useQuery(query);

  return (
    <Details
      iconClosed={<span>?</span>}
      onOpenChange={setOpen}
      title="View FAQs"
      scrollHeight="20rem"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: not relevant. */}
      <div onClick={redirectArkhamDBLinks}>
        {response.loading && "Loading..."}

        {!!response.error && "Error loading FAQ entries."}

        {response.data?.length === 0 && "No FAQ entries."}

        {!!response.data?.length &&
          response.data.map((faq, i) => (
            <p
              // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized.
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.html) }}
              // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
              key={i}
            />
          ))}
      </div>
    </Details>
  );
}
