export type RecommenderState = {
  recommender: {
    includeSideDeck: boolean;
    isRelative: boolean;
  };
};

export type RecommenderSlice = RecommenderState & {
  setIncludeSideDeck(value: boolean): void;
  setIsRelative(value: boolean): void;
};
