## App

- Reflect filters to URL so that views can be shared and get back to @zzorba.
- Make the page work better on larger viewports and get back to @Chr1z.
- Index player cards for traits etc. that occur on the back of the card.

- 'What could be interesting/a nice bonus really cool gimmick if you have the time sometime: some kind of hover effect between certain cards (mainly permanents) and their "related cards"'

## Deckbuilder

- card modals might be a handy way to reduce focus switches when building decks. they suck on mobile though, there we should probably deactivate them.
- there should be some effective way to go from searching for a card to including it in the deck with the keyboard.
- it would be nice to have multiple filter views ("tabs") for the decklist while building a deck.
  filter views for special cards in deck could be auto-created.
- it would be nice to be able to store a filter configuration and searches and later apply it to the deck builder.
- some searches might not be possible with the way the filters currently work: need AND/OR, maybe multiple sets of conditions per field. need to keep an eye out and see what is needed after above things are implemented.

## Arkham Cards API

- add metadata fields to @zzorba's arkham cards API. This would allow us to remove respective the lookup tables:

  - `dynamic icons` in card text (available in @SCED metadata)
  - `uses` in card text (lookup table, available in @SCED metadata)
  - `bonded` (lookup table, also available in @SCED metadata)
  - `action_text` (lookup table)
  - `is_fast` (lookup table)

- add more advanced metadata fields to the arkham cards API and get back to @Buteremelese, e.g.:

  - `deals_damage`
  - `draws_cards`
  - `symbols_matter`
  - ...

- add fields that delimit off-standard artworks to the arkham-cards API. i.e. `is_mirrored`.

## Card data

- verify `51026`
- verify `89005`
- verify `07300`
- verify `04325`
- verify `04326`

## Further plans

- Extract deck validation logic to a library.

- implement a suggestion API for the deck builder. get back to @Buteremelse once their project is up.
- Add more complex property filters, such as:

```
Symbols Matter (both positive and negative effects):
"[After/when/if/for each/anytime] [at least 1] [you reveal] [it has] [a/an] [investigator at your location reveals] [list of all bad symbols/list of all bad symbols except :autofail:/list of all bad symbols except :skull: and :autofail:/:tablet:, :elderthing:, or :eldersign:/non-:eldersign:/non-:autofail:/non-:eldersign: non-:bless:/non-:curse: non-:autofail/:skull: or :autofail:/:skull:/:autofail:/:skull: and :autofail:/:skull: or :curse:] [symbol] [token] [is/was] [reveal/revealed]

Chaos Bag Manipulation:
[do not] [before/When/after you] [would] [reveal[ing]] [a] chaos token[s]
```

- Add archetype filters, e.g. "Oversucceed".
