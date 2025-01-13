import type { Cycle, Pack } from "@/store/services/queries.types";
import PackIcon from "./icons/pack-icon";

type Props = {
  pack: Pack | Cycle;
  shortenNewFormat?: boolean;
};

function shorten(name: string) {
  if (!name) return name;
  return name.replace("Investigator Expansion", "");
}

export function PackName(props: Props) {
  const { pack, shortenNewFormat } = props;

  return (
    <>
      <PackIcon code={pack.code} />
      {shortenNewFormat ? shorten(pack.real_name) : pack.real_name}
    </>
  );
}
