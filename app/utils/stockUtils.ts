/**
 * Determines if a product is in stock based on stock count and is_out_of_stock flag
 * @param stock - The stock count (can be number or string)
 * @param isOutOfStock - The is_out_of_stock flag from API
 * @returns true if product is in stock, false if out of stock
 */
export function isProductInStock(stock: number | string | undefined | null, isOutOfStock?: boolean): boolean {
  // If is_out_of_stock is explicitly true, product is out of stock
  if (isOutOfStock === true) {
    return false;
  }
  
  // Parse stock value (handle string numbers from API)
  const stockCount = typeof stock === 'string' ? parseFloat(stock) : (stock ?? 0);
  
  // If stock is 0 or less, product is out of stock
  if (stockCount <= 0) {
    return false;
  }
  
  // Otherwise, product is in stock
  return true;
}

