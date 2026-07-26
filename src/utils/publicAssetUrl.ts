export function publicAssetUrl(src: string): string {
  if (/^(?:https?:|data:|blob:|\/\/)/.test(src)) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`;
}
