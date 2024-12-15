import { useContext } from "react";
import { ListLayoutContext } from "./list-layout-context";

export function useListLayoutContext() {
  const context = useContext(ListLayoutContext);
  if (!context) {
    throw new Error(
      "useListLayoutContext must be used within a ListLayoutContextProvider",
    );
  }
  return context;
}
