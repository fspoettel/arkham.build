import type { ResolvedDeck } from "@/store/lib/types";

// Duplicate of ./fp.ts, to be used on Decks -
// duplicated with new types to avoid the generics laberynth.

export type Filter = (c: ResolvedDeck) => boolean;

export function and(fns: Filter[]) {
  return (deck: ResolvedDeck) => !fns.length || fns.every((f) => f(deck));
}

export function or(fns: Filter[]) {
  return (deck: ResolvedDeck) => !fns.length || fns.some((f) => f(deck));
}

export function not(fn: Filter): Filter {
  return (deck: ResolvedDeck) => !fn(deck);
}

export function notUnless(notFilter: Filter, unlessFilters: Filter[]) {
  return (deck: ResolvedDeck) => {
    const unless = !!unlessFilters.length && or(unlessFilters)(deck);
    return unless || not(notFilter)(deck);
  };
}
