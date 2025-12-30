/**
 * Validates Bangladeshi phone numbers
 * Rules:
 * - +88 is optional (can be present or not)
 * - If +88 is present, it must be at the start
 * - Number must start with 01
 * - Total 11 digits (excluding optional +88)
 * 
 * Valid formats:
 * - 01712345678 (11 digits starting with 01)
 * - +8801712345678 (+88 followed by 11 digits starting with 01)
 * 
 * @param phone - The phone number to validate
 * @returns Object with isValid boolean and error message
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all whitespace
  const cleaned = phone.trim().replace(/\s+/g, '');

  // Check if it starts with +88
  const hasCountryCode = cleaned.startsWith('+88');
  
  // Extract the number part (remove +88 if present)
  const numberPart = hasCountryCode ? cleaned.substring(3) : cleaned;

  // Check if number part starts with 01
  if (!numberPart.startsWith('01')) {
    return { 
      isValid: false, 
      error: 'Phone number must start with 01' 
    };
  }

  // Check if number part has exactly 11 digits
  const digitCount = numberPart.replace(/\D/g, '').length;
  if (digitCount !== 11) {
    return { 
      isValid: false, 
      error: 'Phone number must have exactly 11 digits (excluding +88)' 
    };
  }

  // Check if number part contains only digits
  if (!/^\d+$/.test(numberPart)) {
    return { 
      isValid: false, 
      error: 'Phone number can only contain digits (and optional +88 prefix)' 
    };
  }

  // If +88 is present, validate the full format
  if (hasCountryCode) {
    const fullNumber = cleaned;
    if (fullNumber !== `+88${numberPart}`) {
      return { 
        isValid: false, 
        error: 'Invalid format. If using +88, it must be followed by 11 digits starting with 01' 
      };
    }
  }

  return { isValid: true };
}

/**
 * Formats phone number for display/storage
 * Removes +88 if present and returns the 11-digit number
 * 
 * @param phone - The phone number to format
 * @returns Formatted phone number (11 digits starting with 01)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  const cleaned = phone.trim().replace(/\s+/g, '');
  
  // Remove +88 if present
  if (cleaned.startsWith('+88')) {
    return cleaned.substring(3);
  }
  
  return cleaned;
}







