-- migrate:up

CREATE TABLE slots_pack_mask (
  decklist_id INTEGER NOT NULL
    REFERENCES arkhamdb_decklist(id) ON DELETE CASCADE,
  is_side_deck BOOLEAN NOT NULL,
  pack_mask BIT(512) NOT NULL,
  PRIMARY KEY (decklist_id, is_side_deck, pack_mask)
);

-- migrate:down

DROP TABLE slots_pack_mask;
