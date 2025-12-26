/**
 * Normalizes image URLs from the API to ensure they work with Next.js Image component
 * @param imageUrl - The image URL from the API (can be relative or absolute)
 * @returns A normalized absolute URL
 */
export function normalizeImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/products/placeholder.jpg';
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with /, it's a root-relative path
  if (imageUrl.startsWith('/')) {
    return `https://seba.rangpurit.com${imageUrl}`;
  }

  // Otherwise, it's a relative path, add the base URL
  return `https://seba.rangpurit.com/${imageUrl}`;
}


