import { useStore } from "@/store";
import { useCallback, useEffect, useRef } from "react";

const FLAG = "easter_egg_agatha";
const TRIGGER = "agathaallalong";

export function useAgathaEasterEggTrigger() {
  const toggleFlag = useStore((state) => state.toggleFlag);
  const flag = useStore((state) => !!state.settings.flags?.[FLAG]);

  const callback = useCallback(
    (val: string) => {
      const match = val === TRIGGER;

      if (match) {
        const confirmed = flag
          ? true
          : confirm(
              "You are about to transform Agatha into her true self. If you ever want to return her to her original form, cast this incantation again.",
            );

        if (confirmed) toggleFlag(FLAG).catch(console.error);
      }

      return match;
    },
    [toggleFlag, flag],
  );

  return callback;
}

const AGATHA_CODES = ["11007", "11008", "11007b", "11008b"];

export function useAgathaEasterEggTransform(code: string) {
  const flag = useStore((state) => !!state.settings.flags?.[FLAG]);
  if (flag && AGATHA_CODES.includes(code)) return `${FLAG}_${code}`;
  return code;
}

export function useAgathaEasterEggHint() {
  const settings = useStore((state) => state.settings);
  const lock = useRef(false);

  useEffect(() => {
    if (!settings.showPreviews || lock.current) return;

    lock.current = true;

    const flag = settings.flags?.[FLAG];

    const action = flag
      ? "transform Agatha back into her original form"
      : "reveal Agatha's true form";

    console.log(
      `%c🦹🏻‍♀️ If you want to ${action}, paste \`agathaallalong\` in the card search. 🦹🏻‍♀️`,
      "color: rebeccapurple; background-color: #eee",
    );
  }, [settings]);
}
