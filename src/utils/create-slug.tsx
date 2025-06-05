export function createSlug(username: string): string {
    return username
        .normalize('NFD') // Remove acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove marcas de acento
        .replace(/[^a-zA-Z0-9]/g, '-') // Substitui caracteres especiais por hífen
        .replace(/-+/g, '-') // Remove múltiplos hífens
        .replace(/^-+|-+$/g, '') // Remove hífens do início/fim
        .toLowerCase()
        .trim();
}