import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import { formatDeckAsText, formatDeckShare } from "@/store/lib/deck-io";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Deck, Id } from "@/store/slices/data.types";
import { download } from "@/utils/download";
import { useCallback } from "react";
import { useLocation } from "wouter";

export function useDeleteDeck() {
  const toast = useToast();
  const [, navigate] = useLocation();
  const deleteDeck = useStore((state) => state.deleteDeck);

  return useCallback(
    async (deckId: Id) => {
      const confirmed = confirm("Are you sure you want to delete this deck?");
      if (confirmed) {
        const toastId = toast.show({
          children: "Deleting deck...",
        });

        try {
          await deleteDeck(deckId, () => navigate("~/"));
          toast.dismiss(toastId);
          toast.show({
            children: "Deck delete successful.",
            duration: 3000,
            variant: "success",
          });
        } catch (err) {
          toast.dismiss(toastId);
          toast.show({
            children: `Deck could not be deleted: ${(err as Error)?.message}.`,
            variant: "error",
          });
        }
      }
    },
    [navigate, toast, deleteDeck],
  );
}

export function useDeleteUpgrade() {
  const toast = useToast();
  const [, navigate] = useLocation();
  const deleteUpgrade = useStore((state) => state.deleteUpgrade);

  return useCallback(
    async (deckId: Id) => {
      const confirmed = confirm(
        "Are you sure you want to delete this upgrade?",
      );
      if (confirmed) {
        const toastId = toast.show({
          children: "Deleting upgrade...",
        });

        try {
          await deleteUpgrade(deckId, (id) => navigate(`/deck/view/${id}`));
          toast.dismiss(toastId);
          toast.show({
            duration: 3000,
            children: "Upgrade delete successful.",
            variant: "success",
          });
        } catch (err) {
          toast.dismiss(toastId);
          toast.show({
            children: `Upgrade could not be deleted: ${
              (err as Error)?.message
            }.`,
            variant: "error",
          });
        }
      }
    },
    [deleteUpgrade, navigate, toast],
  );
}

export function useDuplicateDeck() {
  const toast = useToast();
  const [, navigate] = useLocation();
  const duplicateDeck = useStore((state) => state.duplicateDeck);

  return useCallback(
    (deckId: Id) => {
      try {
        const id = duplicateDeck(deckId);
        navigate(`/deck/view/${id}`);
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
    [duplicateDeck, navigate, toast.show],
  );
}

export function useExportJson() {
  const toast = useToast();

  return useCallback(
    (deck: Deck) => {
      try {
        download(
          JSON.stringify(formatDeckShare(deck), null, 2),
          `arkhambuild-${deck.id}.json`,
          "application/json",
        );
      } catch (err) {
        console.error(err);
        toast.show({
          duration: 3000,
          children: "Failed to export json.",
          variant: "error",
        });
      }
    },
    [toast.show],
  );
}

export function useExportText() {
  const toast = useToast();
  const state = useStore.getState();

  return useCallback(
    (deck: ResolvedDeck) => {
      try {
        download(
          formatDeckAsText(state, deck),
          `arkhambuild-${deck.id}.md`,
          "text/markdown",
        );
      } catch (err) {
        console.error(err);
        toast.show({
          children: "Failed to export markdown.",
          variant: "error",
        });
      }
    },
    [toast.show, state],
  );
}

export function useUploadDeck() {
  const toast = useToast();
  const [, navigate] = useLocation();
  const uploadDeck = useStore((state) => state.uploadDeck);

  return useCallback(
    async (deckId: Id) => {
      const toastId = toast.show({
        children: "Uploading deck...",
        variant: "loading",
      });

      try {
        const id = await uploadDeck(deckId, "arkhamdb");
        toast.dismiss(toastId);
        toast.show({
          children: "Deck upload successful.",
          duration: 3000,
          variant: "success",
        });
        navigate(`/deck/view/${id}`, { replace: true });
      } catch (err) {
        toast.dismiss(toastId);
        toast.show({
          children: `Deck could not be uploaded: ${(err as Error)?.message}.`,
          variant: "error",
        });
      }
    },
    [toast, uploadDeck, navigate],
  );
}
