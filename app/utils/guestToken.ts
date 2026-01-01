export const getGuestToken = (): string => {
    if (typeof window === 'undefined') return '';

    let token = localStorage.getItem('guest_token');
    if (!token) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            token = crypto.randomUUID();
        } else {
            token = 'guest-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        }
        localStorage.setItem('guest_token', token);
    }
    return token;
};
