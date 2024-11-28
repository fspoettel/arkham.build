import { Details } from "@/components/ui/details";
import { useStore } from "@/store";
import type { ResolvedCard } from "@/store/lib/types";
import { selectClientId } from "@/store/selectors/shared";
import { queryFaq } from "@/store/services/queries";
import { redirectArkhamDBLinks } from "@/utils/arkhamdb";
import { useQuery } from "@/utils/use-query";
import DOMPurify from "dompurify";
import { useMemo, useState } from "react";

type Props = {
  card: ResolvedCard["card"];
};

export function Faq(props: Props) {
  const [open, setOpen] = useState(false);
  const { card } = props;

  const clientId = useStore(selectClientId);

  const query = useMemo(
    () => (open ? () => queryFaq(clientId, card.code) : undefined),
    [card.code, open, clientId],
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
        {(response.state === "initial" || response.state === "loading") &&
          "Loading..."}

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
