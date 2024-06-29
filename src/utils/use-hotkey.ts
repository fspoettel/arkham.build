import { useEffect, useMemo } from "react";

type HotKey = {
  key: string;
  modifiers: string[];
};

export function useHotKey(
  hotkeyStr: string,
  callback: (evt: KeyboardEvent) => void,
  deps: unknown[] = [],
) {
  const hotKey = useMemo(() => parseHotKey(hotkeyStr), [hotkeyStr]);

  useEffect(() => {
    function onKeyDown(evt: KeyboardEvent) {
      console.log(evt);
      if (hotKeyMatches(evt, hotKey)) {
        evt.preventDefault();
        callback(evt);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hotKey, callback, ...deps]);
}

function parseHotKey(hotKey: string): HotKey | undefined {
  const parts = hotKey.split("+");
  const key = parts.pop();
  const modifiers = parts;

  if (!key) return undefined;
  return { key, modifiers };
}

function hotKeyMatches(
  evt: KeyboardEvent,
  hotKey: HotKey | undefined,
): boolean {
  if (!hotKey) return false;

  if (hotKey.key.toLowerCase() !== evt.key.toLowerCase()) return false;

  return hotKey.modifiers.every((mod) => {
    switch (mod) {
      case "ctrl":
        return evt.ctrlKey;
      case "alt":
        return evt.altKey;
      case "shift":
        return evt.shiftKey;
      case "cmd":
        return evt.metaKey || evt.ctrlKey;
      default:
        return false;
    }
  });
}
