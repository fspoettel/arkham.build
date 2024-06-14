import { Card } from "@/store/graphql/types";

export type Filter = (c: Card) => boolean;

export function and(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.every((f) => f(card));
}

export function or(fns: Filter[]) {
  return (card: Card) => !fns.length || fns.some((f) => f(card));
}

// TODO: factor out usages of this.
export function pass() {
  return true;
}
