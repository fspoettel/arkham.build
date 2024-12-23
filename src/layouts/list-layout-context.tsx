import { useContext } from "react";
import { createContext } from "react";

type Context = {
  sidebarOpen: boolean;
  filtersOpen: boolean;
  setSidebarOpen(val: boolean): void;
  setFiltersOpen(val: boolean): void;
};

export const ListLayoutContext = createContext<Context>({
  sidebarOpen: false,
  filtersOpen: false,
  setSidebarOpen: () => {},
  setFiltersOpen: () => {},
});

export function useListLayoutContext() {
  const context = useContext(ListLayoutContext);
  if (!context) {
    throw new Error(
      "useListLayoutContext must be used within a ListLayoutContextProvider",
    );
  }
  return context;
}
