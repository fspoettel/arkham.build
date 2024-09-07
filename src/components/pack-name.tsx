import type { Pack } from "@/store/services/queries.types";
import PackIcon from "./icons/pack-icon";

type Props = { pack: Pack };

export function PackName({ pack }: Props) {
  return (
    <>
      <PackIcon code={pack.code} />
      {pack.real_name}
    </>
  );
}
