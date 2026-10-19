-- migrate:up

ALTER TABLE faq ADD COLUMN date DATE;

ALTER TABLE faq DROP CONSTRAINT faq_type_check;
ALTER TABLE faq ADD CONSTRAINT faq_type_check
  CHECK (type IN ('faq', 'rules-form'));

-- Rules form answers have individual dates, not published rules versions.
ALTER TABLE faq DROP CONSTRAINT faq_citation_fkey;

-- migrate:down

DELETE FROM faq WHERE type = 'rules-form';

ALTER TABLE faq DROP COLUMN date;

ALTER TABLE faq DROP CONSTRAINT faq_type_check;
ALTER TABLE faq ADD CONSTRAINT faq_type_check CHECK (type = 'faq');

ALTER TABLE faq ADD CONSTRAINT faq_citation_fkey
  FOREIGN KEY (citation) REFERENCES rules_version(citation) NOT VALID;
