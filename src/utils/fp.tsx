import type { Card } from "@/store/services/queries.types";

export type Filter = (c: Card) => boolean;

export function and(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.every((f) => f(card));
}

export function or(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.some((f) => f(card));
}

export function not(fn: Filter): Filter {
  return (card: Card) => !fn(card);
}

export function notUnless(notFilter: Filter, unlessFilters: Filter[]) {
  return (card: Card) => {
    const unless = !!unlessFilters.length && or(unlessFilters)(card);
    return unless || not(notFilter)(card);
  };
}
