export type SharingState = {
  decks: Record<string, string>; // <id, date_update>
};

export type SharingSlice = {
  sharing: SharingState;
  createShare: (id: string) => Promise<void>;
  deleteShare: (id: string) => Promise<void>;
  deleteAllShares: () => Promise<void>;
  updateShare: (id: string) => Promise<void>;
};
