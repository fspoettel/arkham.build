// biome-ignore lint/suspicious/noExplicitAny: we don't care about typings here.
export function debounce<T extends (...args: any[]) => any>(
  cb: T,
  wait: number,
) {
  // biome-ignore lint/suspicious/noExplicitAny: we don't care about typings here.
  let h: any;

  // biome-ignore lint/suspicious/noExplicitAny: we don't care about typings here.
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };

  return callable;
}
