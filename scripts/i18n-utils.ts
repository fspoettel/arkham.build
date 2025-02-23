import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { applyLocalData } from "../src/store/lib/local-data";
import type { Card } from "../src/store/services/queries.types";
import { cardUses } from "../src/utils/card-utils";
import { capitalize } from "../src/utils/formatting";

const [cards, en] = await Promise.all([queryCards(), readLocale("en")]);

const uses = listUses(cards);
const traits = listTraits(cards);

const deckOptions = listDeckOptions(cards);

en.translation.common.uses = uses.reduce((acc, curr) => {
  acc[curr] = capitalize(curr);
  return acc;
}, {});

en.translation.common.traits = traits.reduce((acc, curr) => {
  acc[curr] = curr;
  return acc;
}, {});

en.translation.common.deck_options = deckOptions.reduce((acc, curr) => {
  acc[curr] = curr;
  return acc;
}, {});

await writeLocale("en", en);

const repoPath = await cloneRepo();

const translations = (await fs.readdir("./src/locales"))
  .filter((file) => file !== "en.json")
  .map((file) => path.basename(file, ".json"));

for (const lng of translations) {
  const arkhamCardsLocale = JSON.parse(
    await fs.readFile(
      path.join(repoPath, "assets/i18n", `${lng}.po.json`),
      "utf-8",
    ),
  );

  const locale = await readLocale(lng);

  for (const key of Object.keys(en.translation.common.uses)) {
    const arkhamCardsTranslation =
      arkhamCardsLocale.translations[""][capitalize(key)]?.msgstr[0];

    if (arkhamCardsTranslation) {
      locale.translation.common.uses[key] = arkhamCardsTranslation;
    } else {
      console.log(`[${lng}] ArkhamCards missing translation for ${key}`);
    }
  }

  for (const key of Object.keys(en.translation.common.traits)) {
    const arkhamCardsTranslation =
      arkhamCardsLocale.translations["trait"][key]?.msgstr[0];

    if (arkhamCardsTranslation) {
      locale.translation.common.traits[key] = arkhamCardsTranslation;
    } else {
      console.log(`[${lng}] ArkhamCards missing translation for ${key}`);
    }
  }

  for (const key of Object.keys(en.translation.common.deck_options)) {
    const arkhamCardsTranslation =
      arkhamCardsLocale.translations[""][key]?.msgstr[0];

    if (arkhamCardsTranslation) {
      locale.translation.common.deck_options[key] = arkhamCardsTranslation;
    } else {
      console.log(`[${lng}] ArkhamCards missing translation for ${key}`);
    }
  }

  await writeLocale(lng, locale);
}

async function cloneRepo() {
  const repo = "git@github.com:zzorba/ArkhamCards.git";
  const localPath = path.join(tmpdir(), "arkham-cards");

  try {
    if ((await fs.stat(localPath)).isDirectory()) {
      await fs.rm(localPath, { recursive: true });
    }
  } catch {}

  await fs.mkdir(localPath);

  execSync(
    `git clone --filter=blob:none ${repo} ${localPath} && cd ${localPath} && git sparse-checkout init --cone && git sparse-checkout set assets/i18n && git checkout master`,
    { stdio: "inherit" },
  );

  return localPath;
}

async function queryCards() {
  const apiCards = await fetch("https://api.arkham.build/v1/cache/cards")
    .then((res) => res.json())
    .then((data) => data.data.all_card);

  return Object.values(
    applyLocalData({
      cards: apiCards,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any).cards,
  );
}

function listTraits(cards: Card[]) {
  return Array.from(
    cards.reduce<Set<string>>((acc, card) => {
      if (!card.real_traits) return acc;

      for (const trait of card.real_traits.split(".")) {
        const value = trait.trim().replace(".", "");
        if (value) acc.add(value);
      }

      return acc;
    }, new Set()),
  ).sort();
}

function listUses(cards: Card[]) {
  return Array.from(
    cards.reduce<Set<string>>((acc, card) => {
      const uses = cardUses(card);
      if (!uses) return acc;

      acc.add(uses);

      return acc;
    }, new Set()),
  ).sort();
}

function listDeckOptions(cards: Card[]) {
  const additionalDeckOptionErrors = [
    "You cannot have more than one Covenant in your deck.",
    "Deck must have at least 10 skill cards.",
    "Atleast constraint violated.",
    "Too many off-class cards.",
  ];

  return Array.from(
    cards.reduce<Set<string>>((acc, card) => {
      if (!card.deck_options) return acc;

      for (const option of card.deck_options) {
        if (option.name) {
          acc.add(option.name);
        }

        if (option.error) {
          acc.add(option.error);
        }

        if (option.option_select) {
          for (const select of option.option_select) {
            acc.add(select.name);
          }
        }
      }

      return acc;
    }, new Set(additionalDeckOptionErrors)),
  ).sort();
}

async function readLocale(language: string) {
  const filePath = path.join(process.cwd(), `./src/locales/${language}.json`);
  const contents = await fs.readFile(filePath, "utf-8");
  return JSON.parse(contents);
}

async function writeLocale(language: string, data: Record<string, unknown>) {
  const filePath = path.join(process.cwd(), `./src/locales/${language}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
