import { MQ_FLOATING_FILTERS, MQ_FLOATING_SIDEBAR } from "@/utils/constants";
import { createContext, useMemo, useState } from "react";

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

export function ListLayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(
    !window.matchMedia(MQ_FLOATING_SIDEBAR).matches,
  );

  const [filtersOpen, setFiltersOpen] = useState(
    !window.matchMedia(MQ_FLOATING_FILTERS).matches,
  );

  const contextValue = useMemo(
    () => ({
      sidebarOpen,
      filtersOpen,
      setSidebarOpen,
      setFiltersOpen,
    }),
    [sidebarOpen, filtersOpen],
  );

  return (
    <ListLayoutContext.Provider value={contextValue}>
      {children}
    </ListLayoutContext.Provider>
  );
}
