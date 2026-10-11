-- migrate:up

alter table oauth_authorization_request
  add column code_challenge text,
  add constraint chk_oauth_authorization_request_code_challenge check (
    code_challenge is null or (
      octet_length(code_challenge) = 43
      and code_challenge ~ '^[A-Za-z0-9_-]+$'
    )
  ) not valid;

alter table oauth_authorization_request
  validate constraint chk_oauth_authorization_request_code_challenge;

alter table oauth_authorization_code
  add column code_challenge text,
  add constraint chk_oauth_authorization_code_code_challenge check (
    code_challenge is null or (
      octet_length(code_challenge) = 43
      and code_challenge ~ '^[A-Za-z0-9_-]+$'
    )
  ) not valid;

alter table oauth_authorization_code
  validate constraint chk_oauth_authorization_code_code_challenge;

-- migrate:down

alter table oauth_authorization_code drop column if exists code_challenge;
alter table oauth_authorization_request drop column if exists code_challenge;
