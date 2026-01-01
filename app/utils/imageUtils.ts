/**
 * Normalizes image URLs from the API to ensure they work with Next.js Image component
 * @param imageUrl - The image URL from the API (can be relative or absolute)
 * @returns A normalized absolute URL
 */
export function normalizeImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/products/placeholder.jpg';
  }

  const BASE_URL = 'https://seba.rangpurit.com';

  // Fix common API issues where it returns internal/local URLs like api.test, localhost, etc.
  // The regex matches http or https followed by :// and any character that is NOT a slash, up to the first slash or end of string.
  // This effectively captures the domain part.

  if (imageUrl.includes('api.test') || imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
    return imageUrl.replace(/^(https?:\/\/[^\/]+)/, BASE_URL);
  }

  // If it's already a full URL that is NOT one of the local ones above, return as is.
  // We check this AFTER the local replacement to ensure local full URLs get fixed.
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with /, it's a root-relative path
  if (imageUrl.startsWith('/')) {
    return `${BASE_URL}${imageUrl}`;
  }

  // Otherwise, it's a relative path, add the base URL
  return `${BASE_URL}/${imageUrl}`;
}
