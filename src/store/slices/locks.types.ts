export type LocksState = {
  arkhamdb: boolean;
  sync: boolean;
};

export type LocksSlice = {
  locks: LocksState;

  setLock(name: keyof LocksState, value: boolean): void;
};
