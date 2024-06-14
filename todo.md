## App

- add a custom persist implementation that only updates indexeddb when relevant data changes.
- resetting filters should close the respective details.

## Arkham Cards API

- add basic metadata fields to @zzorba's arkham cards API. This would allow us to remove respective the lookup tables:
  - `dynamic icons` in card text (available in @SCED metadata)
  - `uses` in card text (available in @SCED metadata)
  - `bonded` (available in @SCED)
  - `action_text` (lookup table)
  - `is_fast` (lookup table)
- add more advanced metadata fields to the arkham cards API and get back to @Buteremelese, e.g.:
  - `deals_damage`
  - `draws_cards`
  - `symbols_matter`
  - ...
- add a `pack_code` field for `encounter_sets` to the arkham-cards API.
- add fields that delimit off-standard artworks to the arkham-cards API. i.e. `is_mirrored`.
- figure out why `all_cards.pack` `all_cards.encounter_sets` relations do not work on arkham-cards API.

## Further plans

- implement a suggestion API for the deck builder. get back to @Buteremelse once their project is up.
