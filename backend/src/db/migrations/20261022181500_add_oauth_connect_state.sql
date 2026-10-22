-- migrate:up

alter table session
  add column oauth_connect_state_hash text,
  add column oauth_connect_expires_at timestamp;

-- migrate:down

alter table session
  drop column oauth_connect_state_hash,
  drop column oauth_connect_expires_at;
