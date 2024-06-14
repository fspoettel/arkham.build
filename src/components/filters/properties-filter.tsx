import SvgStarFill from "../icons/star-fill";
import { Checkbox } from "../ui/checkbox";

import css from "./properties-filter.module.css";

const properties = [
  { key: "bonded", label: "Bonded" },
  { key: "fast", label: "Fast" },
  { key: "customizable", label: "Customizable" },
  { key: "exile", label: "Exile" },
  { key: "seal", label: "Seal" },
  { key: "victory", label: "Victory" },
  { key: "non-unique", label: "Non-unique" },
  {
    key: "unique",
    // FIXME: investigate better ways to make align the icon (how does fontawesome do it?)
    label: (
      <>
        Unique (
        <SvgStarFill
          style={{ verticalAlign: "middle", display: "inline-flex" }}
        />
        )
      </>
    ),
  },
];

export function PropertiesFilter() {
  return (
    <div className={css["container"]}>
      {properties.map(({ key, label }) => (
        <Checkbox key={key} label={label} id={`property-${key}`} />
      ))}
    </div>
  );
}
