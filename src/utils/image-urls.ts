export function rewriteImageUrl(url?: string) {
  const id = url?.split("/").at(-1);
  return id ? `${import.meta.env.VITE_CARD_IMAGE_URL}/${id}` : undefined;
}
