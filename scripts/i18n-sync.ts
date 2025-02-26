import assert from "node:assert";
import fs from "node:fs";

type JsonObject = { [key: string]: JsonValue };

type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;

syncLocales("en");

function syncLocales(primary: string) {
  const primaryLocale = JSON.parse(
    fs.readFileSync(`./src/locales/${primary}.json`, "utf-8"),
  );

  for (const localePath of fs.readdirSync("./src/locales")) {
    if (localePath === `${primary}.json`) continue;

    const locale = JSON.parse(
      fs.readFileSync(`./src/locales/${localePath}`, "utf-8"),
    );

    const synced = sync(primaryLocale, locale);
    const formatted = JSON.stringify(sortJSON(synced), null, 2);

    fs.writeFileSync(`./src/locales/${localePath}`, formatted);
  }
}

function sync(primary: JsonObject, locale: JsonObject) {
  const newLocale = {};

  for (const key in primary) {
    if (Array.isArray(primary[key])) {
      throw new Error("Arrays are not supported in locale files.");
    }

    if (isObject(primary[key])) {
      newLocale[key] = sync(
        primary[key],
        isObject(locale[key]) ? locale[key] : {},
      );
    } else {
      let found = 0;

      for (const k of getPlurals(key)) {
        if (locale[k]) {
          assert(
            typeof locale[k] === "string",
            `Invalid value for ${k}: should be a string.`,
          );
          found += 1;
          newLocale[k] = locale[k];
        }
      }

      if (!found) {
        newLocale[key] = primary[key];
      }
    }
  }

  return newLocale;
}

function isObject(x: unknown): x is JsonObject {
  return typeof x === "object" && x !== null;
}

function getPlurals(key: string) {
  const pluralKeys = ["zero", "one", "two", "few", "many", "other"];

  const root = pluralKeys.some((pluralKey) => key.endsWith(`_${pluralKey}`))
    ? key.slice(0, key.lastIndexOf("_"))
    : key;

  const keys = pluralKeys.map((pluralKey) => `${root}_${pluralKey}`);
  keys.unshift(root);
  return keys;
}

function sortJSON(obj: JsonValue) {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) return obj.map(sortJSON);

  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = sortJSON(obj[key]);
      return acc;
    }, {});
}
