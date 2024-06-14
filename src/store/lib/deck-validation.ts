import { cardLevel } from "@/utils/card-utils";
import { SPECIAL_CARD_CODES } from "@/utils/constants";

import type { Card, DeckOption, DeckRequirements } from "../services/types";
import type { StoreState } from "../slices";
import type { Deck } from "../slices/data/types";
import type { LookupTables } from "../slices/lookup-tables/types";
import type { InvestigatorAccessConfig } from "./filtering";
import {
  filterInvestigatorAccess,
  filterInvestigatorWeaknessAccess,
  makeOptionFilter,
} from "./filtering";
import type { ResolvedCard, ResolvedDeck } from "./types";

type DeckValidationResult = {
  valid: boolean;
  errors: Error[];
};

export type ValidationError =
  | "INVALID_INVESTIGATOR"
  | "INVALID_DECK_OPTION"
  | "FORBIDDEN"
  | "TOO_MANY_CARDS"
  | "TOO_FEW_CARDS"
  | "DECK_REQUIREMENTS_NOT_MET"
  | "INVALID_CARD_COUNT";

type BaseError = {
  type: ValidationError;
};

export type DeckOptionsError = {
  type: "INVALID_DECK_OPTION";
  details: {
    error: string;
  };
};

export type InvalidCardError = {
  type: "INVALID_CARD_COUNT";
  details: {
    real_name: string;
    code: string;
    limit: number;
    quantity: number;
  }[];
};

export type ForbiddenCardError = {
  type: "FORBIDDEN";
  details: {
    real_name: string;
    code: string;
  }[];
};

type Error =
  | BaseError
  | InvalidCardError
  | ForbiddenCardError
  | DeckOptionsError;

function formatReturnValue(errors: Error[]) {
  return { valid: errors.length === 0, errors };
}

export function getAdditionalDeckOptions(
  deck: Deck | ResolvedDeck<ResolvedCard>,
) {
  const additionalDeckOptions: DeckOption[] = [];

  if (deck.slots[SPECIAL_CARD_CODES.VERSATILE]) {
    additionalDeckOptions.push({
      level: { min: 0, max: 0 },
      limit: deck.slots[SPECIAL_CARD_CODES.VERSATILE],
      error: "Too many off-class cards for Versatile.",
    });
  }

  if (deck.slots[SPECIAL_CARD_CODES.ON_YOUR_OWN]) {
    additionalDeckOptions.push({
      not: true,
      slot: ["Ally"],
      level: { min: 0, max: 5 },
      error: "You cannot have assets that take up an ally slot.",
      virtual: true,
    });
  }

  return additionalDeckOptions;
}

export function validateDeck(
  deck: ResolvedDeck<ResolvedCard>,
  state: StoreState,
): DeckValidationResult {
  console.time("[perf] validate_deck");

  if (!validateInvestigator(deck)) {
    return {
      valid: false,
      errors: [{ type: "INVALID_INVESTIGATOR" }],
    };
  }

  const errors: Error[] = [
    ...validateDeckSize(deck),
    ...validateSlots(deck, state),
  ];

  console.timeEnd("[perf] validate_deck");
  return formatReturnValue(errors);
}

function validateInvestigator(deck: ResolvedDeck<ResolvedCard>) {
  const investigatorBack = deck.investigatorBack.card;
  if (!investigatorBack.deck_options) return false;

  let valid = true;

  for (const option of investigatorBack.deck_options) {
    if (option.deck_size_select) {
      valid = !!deck.metaParsed.deck_size_selected;
    } else if (option.faction_select) {
      valid =
        !!deck.metaParsed.faction_selected ||
        (!!deck.metaParsed.faction_1 && !!deck.metaParsed.faction_2);
    } else if (option.option_select) {
      valid = !!deck.metaParsed.option_selected;
    }

    if (!valid) break;
  }

  return valid;
}

const SIZE_ADJUSTMENTS = {
  [SPECIAL_CARD_CODES.ANCESTRAL_KNOWLEDGE]: 5,
  [SPECIAL_CARD_CODES.FORCED_LEARNING]: 15,
  [SPECIAL_CARD_CODES.UNDERWORLD_MARKET]: 10,
  [SPECIAL_CARD_CODES.UNDERWORLD_SUPPORT]: -5,
  [SPECIAL_CARD_CODES.VERSATILE]: 5,
};

function validateDeckSize(deck: ResolvedDeck<ResolvedCard>): Error[] {
  const investigatorBack = deck.investigatorBack.card;

  let investigatorDeckSize = investigatorBack.deck_requirements?.size ?? 0;

  // special case: deck size selection.
  const hasDeckSizeOption = investigatorBack.deck_options?.some(
    (o) => !!o.deck_size_select,
  );
  if (hasDeckSizeOption) {
    investigatorDeckSize = Number.parseInt(
      deck.metaParsed.deck_size_selected as string,
      10,
    );
  }

  // special case: option selection.
  const optionSelect = investigatorBack.deck_options?.find(
    (o) => !!o.option_select,
  );
  const selectedOption = optionSelect?.option_select?.find(
    (o) => o.id === deck.metaParsed.option_selected,
  );
  if (selectedOption?.size) investigatorDeckSize += selectedOption.size;

  const adjustment = Object.entries(SIZE_ADJUSTMENTS).reduce<number>(
    (acc, [code, adjustment]) => {
      return deck.slots[code] ? acc + adjustment * deck.slots[code] : acc;
    },
    0,
  );

  const deckSize = deck.stats.deckSize;
  const targetDeckSize = investigatorDeckSize + adjustment;

  return deckSize !== targetDeckSize
    ? deckSize > targetDeckSize
      ? [{ type: "TOO_MANY_CARDS" }]
      : [{ type: "TOO_FEW_CARDS" }]
    : [];
}

function validateSlots(
  deck: ResolvedDeck<ResolvedCard>,
  state: StoreState,
): Error[] {
  const validators = [
    new DeckLimitsValidator(deck),
    new DeckRequiredCardsValidator(deck),
    new DeckOptionsValidator(deck, state),
  ];

  for (const [code, quantity] of Object.entries(deck.slots)) {
    const { card } = deck.cards.slots[code];
    if (card.encounter_code) {
      continue;
    }

    // normalize duplicates to base version before checking access.
    const normalized = card.duplicate_of_code
      ? state.metadata.cards[card.duplicate_of_code]
      : card;

    validators.forEach((validator) => {
      validator.add(normalized, quantity);
    });
  }

  return validators.flatMap((validator) => validator.validate());
}

interface SlotValidator {
  add(card: Card, quantity: number): void;
  validate(): Error[];
}

type DeckLimitViolation = {
  code: string;
  limit: number;
  quantity: number;
  real_name: string;
};

class DeckLimitsValidator implements SlotValidator {
  limitOverride: number | undefined;
  selectedDeckSize: number | undefined;
  violations: Record<string, DeckLimitViolation> = {};
  quantityByName: Record<string, number> = {};
  ignoreDeckLimitSlots: Record<string, number> = {};

  constructor(deck: ResolvedDeck<ResolvedCard>) {
    this.ignoreDeckLimitSlots = deck.ignoreDeckLimitSlots ?? {};
    if (deck.slots[SPECIAL_CARD_CODES.UNDERWORLD_SUPPORT]) {
      this.limitOverride = 1;
    }

    const hasDeckSizeSelect = deck.investigatorBack.card.deck_options?.some(
      (o) => o.deck_size_select,
    );

    const deckSizeSelection = deck.metaParsed.deck_size_selected;

    if (hasDeckSizeSelect && deckSizeSelection) {
      this.selectedDeckSize = Number.parseInt(deckSizeSelection, 10);
    }
  }

  add(card: Card, quantity: number) {
    const name = `${card.real_name}${card.real_subname}`;

    if (card.xp == null && card.subtype_code !== "basicweakness") {
      if (
        card.code === SPECIAL_CARD_CODES.OCCULT_EVIDENCE &&
        this.selectedDeckSize
      ) {
        const limit = (this.selectedDeckSize - 20) / 10;
        if (quantity !== limit) {
          this.violations[name] = {
            code: card.code,
            limit,
            quantity,
            real_name: card.real_name,
          };
        }
      } else if (quantity !== (card.quantity ?? 0)) {
        this.violations[name] = {
          code: card.code,
          limit: card.quantity,
          quantity,
          real_name: card.real_name,
        };
      }

      return;
    }

    const limit = this.limitOverride ?? card.deck_limit ?? 0;

    // some copies of this card might be ignored, e.g. for parallel Agnes and TCU "Ace of Rods".
    const copies = quantity - (this.ignoreDeckLimitSlots[card.code] ?? 0);

    this.quantityByName[name] ??= 0;
    this.quantityByName[name] += copies;

    if (this.quantityByName[name] > limit) {
      this.violations[name] = {
        code: card.code,
        limit,
        quantity: this.quantityByName[name],
        real_name: card.real_name,
      };
    }
  }

  validate(): Error[] {
    const violations = Object.values(this.violations);
    return violations.length
      ? [
          {
            type: "INVALID_CARD_COUNT",
            details: violations,
          },
        ]
      : [];
  }
}

class DeckRequiredCardsValidator implements SlotValidator {
  requirements: DeckRequirements["card"];
  cards: Card[] = [];
  quantities: number[] = [];

  constructor(deck: ResolvedDeck<ResolvedCard>) {
    const investigatorBack = deck.investigatorBack.card;

    this.requirements = (
      investigatorBack.deck_requirements as DeckRequirements
    ).card;
  }

  add(card: Card, quantity: number) {
    if (card.xp == null && card.subtype_code !== "basicweakness") {
      this.cards.push(card);
      this.quantities.push(quantity);
    }
  }

  // TODO: validate that signatures are pairs.
  validate(): Error[] {
    const requirementCounts = Object.keys(this.requirements).reduce(
      (counts, code) => {
        counts[code] = 0;
        return counts;
      },
      {} as Record<string, number>,
    );

    for (let i = 0; i < this.cards.length; i += 1) {
      const card = this.cards[i];
      const quantity = this.quantities[i];

      const matches = Object.entries(this.requirements).filter(
        (r) => !!r[1][card.code],
      );

      for (const match of matches) {
        requirementCounts[match[0]] += quantity;
      }
    }

    const matchesRequirements = Object.entries(requirementCounts).every(
      (x) => x[1] !== 0,
    );

    return matchesRequirements ? [] : [{ type: "DECK_REQUIREMENTS_NOT_MET" }];
  }
}

class DeckOptionsValidator implements SlotValidator {
  cards: Card[] = [];
  config: InvestigatorAccessConfig;
  deckOptions: DeckOption[];
  forbidden: Card[] = [];
  lookupTables: LookupTables;
  playerCardFilter: (card: Card) => boolean;
  quantities: Record<string, number> = {};
  weaknessFilter: (card: Card) => boolean;

  constructor(deck: ResolvedDeck<ResolvedCard>, state: StoreState) {
    const investigatorBack = deck.investigatorBack.card;
    this.lookupTables = state.lookupTables;

    const { config, deckOptions } = this.configure(deck);
    this.config = config;
    this.deckOptions = deckOptions;

    this.playerCardFilter = filterInvestigatorAccess(
      investigatorBack,
      state.lookupTables,
      config,
    );

    this.weaknessFilter = filterInvestigatorWeaknessAccess(
      investigatorBack,
      state.lookupTables,
    );
  }

  configure(deck: ResolvedDeck<ResolvedCard>): {
    config: InvestigatorAccessConfig;
    deckOptions: DeckOption[];
  } {
    const deckOptions: DeckOption[] = [
      {
        trait: ["Covenant"],
        limit: 1,
        virtual: true,
        error: "You cannot have more than one Covenant in your deck.",
      },
    ];

    deckOptions.push(
      ...(deck.investigatorBack.card.deck_options as DeckOption[]),
    );

    if (deck.slots[SPECIAL_CARD_CODES.ANCESTRAL_KNOWLEDGE]) {
      deckOptions.push({
        atleast: {
          min: 10,
          types: 1,
        },
        type: ["skill"],
        virtual: true,
        error: "Deck must have at least 10 skill cards.",
      });
    }

    const additionalDeckOptions = getAdditionalDeckOptions(deck);

    deckOptions.push(...additionalDeckOptions);

    return {
      config: {
        factionSelected: deck.metaParsed.faction_selected,
        ignoreUnselectedCustomizableOptions: true,
        optionSelected: deck.metaParsed.option_selected,
        additionalDeckOptions,
      },
      deckOptions,
    };
  }

  add(card: Card, quantity: number) {
    if (card.subtype_code && !this.weaknessFilter(card)) {
      this.forbidden.push(card);
    } else if (!card.subtype_code && !this.playerCardFilter(card)) {
      this.forbidden.push(card);
    } else if ((cardLevel(card) ?? 0) > 5) {
      this.forbidden.push(card);
    }

    this.cards.push(card);
    this.quantities[card.code] = quantity;
  }

  validate() {
    const errors: Error[] = [
      ...this.validateAtLeast(this.deckOptions),
      ...this.validateLimit(this.deckOptions),
    ];

    if (this.forbidden.length) {
      errors.push({
        type: "FORBIDDEN" as const,
        details: this.forbidden.map((card) => ({
          code: card.code,
          real_name: card.real_name,
        })),
      });
    }

    return errors;
  }

  validateAtLeast(options: DeckOption[]): Error[] {
    const errors: Error[] = [];

    for (const option of options) {
      if (!option.atleast) continue;
      const min = option.atleast.min;
      const factionCount = option.atleast.factions;
      const typeCount = option.atleast.types;

      const clustered: Record<string, number> = {};

      if (factionCount) {
        for (const card of this.cards) {
          clustered[card.faction_code] ??= 0;
          clustered[card.faction_code] += this.quantities[card.code];

          if (card.faction2_code) {
            clustered[card.faction2_code] ??= 0;
            clustered[card.faction2_code] += this.quantities[card.code];
          }

          if (card.faction3_code) {
            clustered[card.faction3_code] ??= 0;
            clustered[card.faction3_code] += this.quantities[card.code];
          }
        }
      } else if (typeCount) {
        for (const card of this.cards) {
          clustered[card.type_code] ??= 0;
          clustered[card.type_code] += this.quantities[card.code];
        }
      }

      const matches = Object.entries(clustered).filter(([key, val]) => {
        const target = factionCount ? option.faction : option.type;
        return target?.includes(key) && val >= min;
      });

      const target = factionCount ? factionCount : typeCount;

      if (matches.length < (target ?? 0)) {
        errors.push({
          type: "INVALID_DECK_OPTION",
          details: {
            error: option.error ?? "Atleast constraint violated.",
          },
        });
      }
    }

    return errors;
  }

  validateLimit(options: DeckOption[]): Error[] {
    const errors: Error[] = [];

    const limitMatched: Set<string> = new Set();

    for (const option of options) {
      if (option.atleast) continue;

      const filter = makeOptionFilter(
        option as DeckOption,
        this.lookupTables,
        this.config,
      );
      let matchCount = 0;

      if (filter) {
        for (const card of this.cards) {
          if (limitMatched.has(card.code)) continue;
          const matches = filter(card);
          if (matches) matchCount += this.quantities[card.code];
          if (matches && !option.virtual && !option.not) {
            limitMatched.add(card.code);
          }
        }
      }

      if (option.limit != null && matchCount > option.limit) {
        errors.push({
          type: "INVALID_DECK_OPTION",
          details: {
            error:
              option.error ??
              `Too many off-class cards (${matchCount} / ${option.limit}).`,
          },
        });
      }
    }

    return errors;
  }
}
