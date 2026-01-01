import Hashids from 'hashids';

const hashids = new Hashids('pickaboo-clone-secret-salt', 10);

export const encodeId = (id: string | number): string => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return id.toString(); // Return as-is if not a valid number
    return hashids.encode(numericId);
};

export const decodeId = (hash: string): number | null => {
    const decoded = hashids.decode(hash);
    if (decoded.length === 0) return null;
    return Number(decoded[0]);
};
