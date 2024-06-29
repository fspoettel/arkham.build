export function inputFocused() {
  return (
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLSelectElement
  );
}

export function commandOrControlPressed(event: KeyboardEvent) {
  return event.metaKey || event.ctrlKey;
}
