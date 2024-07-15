import { selectActiveDeckById } from "@/store/selectors/deck-view";
import { StoreState } from "@/store/slices";
import deckCustomizable from "@/test/fixtures/decks/customizable.json";
import deckSpirits from "@/test/fixtures/decks/extra_slots.json";
import deckMultiFaction from "@/test/fixtures/decks/multi_faction_select.json";
import { getMockStore } from "@/test/get-mock-store";
import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";
import { DisplayDeck } from "../deck-grouping";
import { formatDeckAsText } from "./deck-io";

describe("formatDeckAsText()", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
    const state = store.getState();
    store.setState({
      ...state,
      data: {
        ...state.data,
        decks: {
          customizable: deckCustomizable,
          spirits: deckSpirits,
          multiFaction: deckMultiFaction,
        },
        history: {
          customizable: [],
          multiFaction: [],
          spirits: [],
        },
      },
    });
  });

  it("formats customizable", () => {
    const state = store.getState();
    const deck = selectActiveDeckById(state, "customizable", false);
    const result = formatDeckAsText(store.getState(), deck as DisplayDeck);
    expect(result).toMatchInlineSnapshot(`
      "# The Adventures of Carolyn Fern

      Investigator: Carolyn Fern  

      Experience: 47  
      Taboo†: 2.1 (Aug 30, 2023)  

      ## Deck

      **Asset**  
      _Hand_
      - Alchemical Distillation (C) x2
        - Mending Distillate.
        - Calming Distillate.
        - Refined.
        - Empowered.
        - Perfected.

      _Hand x2_
      - Runic Axe† (C) x2
        - Heirloom.
        - Inscription of Glory.

      _Arcane_
      - Hunter's Armor (C) x2
        - Enchanted.
        - Durable.
        - Hallowed.
        - Lightweight.
      - Summoned Servitor (C) x2
        - Claws that Catch.
        - Dominance. Choice: Ally

      _Body_
      - Living Ink (C) x2
        - Chosen skill: Willpower
        - Shifting Ink.
        - Eldritch Ink. Choice: Intellect
        - Eldritch Ink. Choice: Agility

      _Other_
      - Empirical Hypothesis (C) x2
        - Trial and Error.
        - Research Grant.
      - Hypnotic Therapy

      **Event**
      - Friends in Low Places (C) x2
        - Chosen Trait: Innate
        - Versatile. Choice: Illicit
        - Prompt.
      - Power Word† (C) x3
        - Cower.
        - Thrice Spoken.
      - The Raven Quill (C) x2
        - Named Tome or Spell asset: Abyssal Tome
        - Spectral Binding.
        - Endless Inkwell. Choice: Abyssal Tome, Old Book of Lore

      **Skill**
      - Grizzled (C) x2
        - Traits chosen: Innate, Expert
        - Specialist. Choice: Practiced

      **Treachery**
      - Random Basic Weakness
      - Rational Thought

      "
    `);
  });

  it("formats the spirit deck", () => {
    const state = store.getState();
    const deck = selectActiveDeckById(state, "spirits", false);
    const result = formatDeckAsText(store.getState(), deck as DisplayDeck);
    expect(result).toMatchInlineSnapshot(`
      "# The Jim Culver Mysteries

      Investigator: Jim Culver  
      Parallel: Original Front, Parallel Back  

      Experience: 0  

      ## Deck

      **Asset**  
      _Hand_
      - Gravedigger's Shovel x2
      - Hallowed Chalice
      - Jim's Trumpet
      - Knife
      - Ritual Candles x2

      _Accessory_
      - Grisly Totem

      _Ally_
      - Sled Dog

      _Arcane_
      - Armageddon
      - Clarity of Mind
      - Eye of Chaos
      - Obfuscation x2
      - Scrying

      _Hand. Arcane_
      - Enchanted Blade

      _Other_
      - Arcane Studies
      - Blood Pact
      - Forbidden Knowledge

      _Permanent_
      - Down the Rabbit Hole
      - The Beyond

      **Event**
      - Delve Too Deep
      - Deny Existence
      - Drawn to the Flame
      - Ethereal Form
      - Ethereal Slip
      - Explosive Ward
      - Power Word (C)
      - Ward of Radiance
      - Waylay

      **Skill**
      - Enraptured
      - Grizzled (C)
      - Reckless Assault

      **Treachery**
      - Final Rhapsody
      - Random Basic Weakness

      ## Spirits

      **Asset**  
      _Ally_
      - Arcane Initiate
      - Beat Cop
      - Eldritch Sophist
      - Familiar Spirit
      - Gregory Gry
      - Henry Wan
      - Laboratory Assistant
      - Madame Labranche
      - Medical Student

      **Enemy**
      - Vengeful Shade

      "
    `);
  });

  it("formats multi-faction decks", () => {
    const state = store.getState();
    const deck = selectActiveDeckById(state, "multiFaction", false);
    const result = formatDeckAsText(store.getState(), deck as DisplayDeck);
    expect(result).toMatchInlineSnapshot(`
      "# Benchmark Charlie (Quick Guide)

      Investigator: Charlie Kane  
      Faction 1: Guardian  
      Faction 2: Survivor  

      Experience: 33  
      Taboo†: 2.0 (Aug 26, 2022)  

      ## Deck

      **Asset**  
      _Hand_
      - Fire Axe x2

      _Accessory_
      - Hallowed Mirror

      _Ally_
      - Bonnie Walsh
      - Laboratory Assistant x2
      - Leo De Luca (1)
      - Michael Leigh (5)
      - Miss Doyle (1)

      _Ally. Arcane_
      - Summoned Hound (1) x2

      _Other_
      - Drawing Thin† x2
      - Safeguard (2) x2

      _Permanent_
      - Charisma (3) x2
      - In the Thick of It

      **Event**
      - A Chance Encounter (2) x2
      - Calling in Favors x2
      - Gang Up (1) x2
      - Motivational Speech x2

      **Skill**
      - Inspiring Presence x2
      - Strength in Numbers (1) x2
      - Take Heart x2
      - Vicious Blow x2

      **Treachery**
      - Burden of Leadership
      - Random Basic Weakness

      "
    `);
  });
});
