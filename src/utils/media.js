export function normalizeMediaUrl(src) {
  if (!src || typeof src !== "string") {
    return "";
  }

  const trimmedSrc = src.trim();

  if (!trimmedSrc) {
    return "";
  }

  const isBrowser =
    typeof window !== "undefined" && typeof window.location !== "undefined";
  const isSecureContext = isBrowser && window.location.protocol === "https:";

  if (!isSecureContext) {
    return trimmedSrc;
  }

  if (
    trimmedSrc.startsWith("https://") ||
    trimmedSrc.startsWith("blob:") ||
    trimmedSrc.startsWith("data:")
  ) {
    return trimmedSrc;
  }

  if (trimmedSrc.startsWith("http://")) {
    return `https://${trimmedSrc.slice("http://".length)}`;
  }

  return trimmedSrc;
}
