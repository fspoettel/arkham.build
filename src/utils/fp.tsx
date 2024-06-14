import { Card } from "@/store/services/types";

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

// TODO: factor out usages of this.
export function pass() {
  return true;
}
