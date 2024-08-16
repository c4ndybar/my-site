
export function getDateFromExpiration(expiresInSeconds: number): Date {
    return new Date(Date.now() + expiresInSeconds * 1000);
}