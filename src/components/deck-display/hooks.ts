import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import type { Id } from "@/store/slices/data.types";
import { useCallback } from "react";
import { useLocation } from "wouter";

export function useDeleteDeck() {
  const toast = useToast();
  const [_, setLocation] = useLocation();
  const deleteDeck = useStore((state) => state.deleteDeck);

  return useCallback(
    async (deckId: Id) => {
      const confirmed = confirm("Are you sure you want to delete this deck?");
      if (confirmed) {
        await deleteDeck(deckId, toast);
        setLocation("~/");
      }
    },
    [setLocation, toast, deleteDeck],
  );
}

export function useDeleteUpgrade() {
  const toast = useToast();
  const [_, setLocation] = useLocation();
  const deleteUpgrade = useStore((state) => state.deleteUpgrade);

  return useCallback(
    (deckId: Id) => {
      const confirmed = confirm(
        "Are you sure you want to delete this upgrade?",
      );
      if (confirmed) {
        const id = deleteUpgrade(deckId);
        setLocation(`/deck/view/${id}`);
        toast.show({
          duration: 3000,
          children: "Upgrade delete successful.",
          variant: "success",
        });
      }
    },
    [deleteUpgrade, setLocation, toast],
  );
}

export function useDuplicateDeck() {
  const toast = useToast();
  const [_, setLocation] = useLocation();
  const duplicateDeck = useStore((state) => state.duplicateDeck);

  return useCallback(
    (deckId: Id) => {
      try {
        const id = duplicateDeck(deckId);
        setLocation(`/deck/view/${id}`);
        toast.show({
          duration: 3000,
          children: "Deck duplicate successful.",
          variant: "success",
        });
      } catch (err) {
        toast.show({
          children: `Failed to duplicate deck: ${(err as Error)?.message}`,
          variant: "error",
        });
      }
    },
    [duplicateDeck, setLocation, toast.show],
  );
}

export function useExportJson() {
  const toast = useToast();
  const exportJson = useStore((state) => state.exportJSON);

  return useCallback(
    (deckId: Id) => {
      try {
        exportJson(deckId);
      } catch (err) {
        console.error(err);
        toast.show({
          duration: 3000,
          children: "Failed to export json.",
          variant: "error",
        });
      }
    },
    [exportJson, toast.show],
  );
}

export function useExportText() {
  const toast = useToast();
  const exportText = useStore((state) => state.exportText);

  return useCallback(
    (deckId: Id) => {
      try {
        exportText(deckId);
      } catch (err) {
        console.error(err);
        toast.show({
          children: "Failed to export markdown.",
          variant: "error",
        });
      }
    },
    [exportText, toast.show],
  );
}
