-- migrate:up

CREATE INDEX idx_arkhamdb_decklist_taboo_id
  ON arkhamdb_decklist(taboo_id)
  WHERE taboo_id IS NOT NULL;

-- migrate:down

DROP INDEX IF EXISTS idx_arkhamdb_decklist_taboo_id;
