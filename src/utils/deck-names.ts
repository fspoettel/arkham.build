export function getDefaultDeckName(name: string, faction: string) {
  switch (faction) {
    case "guardian":
      return `The Adventures of ${name}`;

    case "seeker":
      return `${name} Investigates`;

    case "rogue":
      return `The ${name} Job`;

    case "mystic":
      return `The ${name} Mysteries`;

    case "survivor":
      return `${name} on the Road`;

    case "neutral":
    default:
      return `${name} Does It All`;
  }
}
