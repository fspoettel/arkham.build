import type { Cycle, Pack } from "@/store/services/queries.types";
import { displayPackName, shortenPackName } from "@/utils/formatting";
import PackIcon from "./icons/pack-icon";

type Props = {
  pack: Pack | Cycle;
  shortenNewFormat?: boolean;
};

export function PackName(props: Props) {
  const { pack, shortenNewFormat } = props;

  const name = displayPackName(pack);

  return (
    <>
      <PackIcon code={pack.code} />
      {shortenNewFormat ? shortenPackName(pack as Pack) : name}
    </>
  );
}
