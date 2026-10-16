-- migrate:up

CREATE TABLE canonical_card_pack_codes (
  canonical_card_id VARCHAR(255) PRIMARY KEY
    REFERENCES card(id),
  pack_codes BIT(512) NOT NULL
);

-- migrate:down

DROP TABLE canonical_card_pack_codes;

