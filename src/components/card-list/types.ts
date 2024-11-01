import type { ListState } from "@/store/selectors/lists";
import type { Slots } from "@/store/slices/data.types";
import type { Search, ViewMode } from "@/store/slices/lists.types";
import type { Metadata } from "@/store/slices/metadata.types";
import type { Props as ListCardProps } from "../list-card/list-card";

export type CardListProps = {
  className?: string;
  itemSize?: "xs" | "sm" | "investigator";
  onChangeCardQuantity?: ListCardProps["onChangeCardQuantity"];
  quantities?: Slots;
  renderCardAction?: ListCardProps["renderCardAction"];
  renderCardExtra?: ListCardProps["renderCardExtra"];
  renderCardMetaExtra?: ListCardProps["renderCardMetaExtra"];
  renderCardAfter?: ListCardProps["renderCardAfter"];
  slotLeft?: React.ReactNode;
  slotRight?: React.ReactNode;
  targetDeck?: "slots" | "extraSlots" | "both";
};

export type CardListImplementationProps = Omit<
  CardListProps,
  "className" | "targetDeck" | "slotLeft" | "slotRight"
> & {
  data: ListState;
  metadata: Metadata;
  viewMode: ViewMode;
  search?: Search;
};

export type CardListItemProps = Pick<
  CardListImplementationProps,
  | "itemSize"
  | "onChangeCardQuantity"
  | "quantities"
  | "renderCardAction"
  | "renderCardAfter"
  | "renderCardExtra"
  | "renderCardMetaExtra"
>;
