/**
 * Calcula la distancia de Levenshtein entre dos strings
 * (número mínimo de ediciones necesarias para transformar una string en otra)
 */
export const levenshteinDistance = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Inicializar matriz
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Llenar matriz
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // eliminación
        matrix[i][j - 1] + 1, // inserción
        matrix[i - 1][j - 1] + cost // sustitución
      );
    }
  }

  return matrix[len1][len2];
};

/**
 * Calcula la similitud entre dos strings (0-1)
 */
export const stringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
};

/**
 * Encuentra la mejor coincidencia para una query en una lista de opciones
 */
export const findBestMatch = (
  query: string,
  options: string[],
  threshold: number = 0.6
): { match: string; similarity: number } | null => {
  let bestMatch: string | null = null;
  let bestSimilarity = 0;

  for (const option of options) {
    const similarity = stringSimilarity(query, option);
    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity;
      bestMatch = option;
    }
  }

  return bestMatch ? { match: bestMatch, similarity: bestSimilarity } : null;
};

/**
 * Normaliza un string para búsqueda (elimina acentos, convierte a minúsculas)
 */
export const normalizeForSearch = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^\w\s]/g, '') // eliminar caracteres especiales
    .trim();
};

/**
 * Verifica si una query coincide con un texto (fuzzy search)
 */
export const fuzzyMatch = (query: string, text: string, threshold: number = 0.7): boolean => {
  const normalizedQuery = normalizeForSearch(query);
  const normalizedText = normalizeForSearch(text);

  // Coincidencia exacta
  if (normalizedText.includes(normalizedQuery)) return true;

  // Coincidencia por palabras
  const queryWords = normalizedQuery.split(/\s+/);
  const textWords = normalizedText.split(/\s+/);

  for (const queryWord of queryWords) {
    let found = false;
    for (const textWord of textWords) {
      if (stringSimilarity(queryWord, textWord) >= threshold) {
        found = true;
        break;
      }
    }
    if (!found) return false;
  }

  return true;
};

/**
 * Obtiene sugerencias de corrección para errores tipográficos
 */
export const getSpellingSuggestions = (
  query: string,
  dictionary: string[],
  maxSuggestions: number = 3,
  threshold: number = 0.6
): string[] => {
  const suggestions: Array<{ word: string; similarity: number }> = [];

  for (const word of dictionary) {
    const similarity = stringSimilarity(query, word);
    if (similarity >= threshold && similarity < 1) {
      suggestions.push({ word, similarity });
    }
  }

  return suggestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxSuggestions)
    .map((s) => s.word);
};

/**
 * Resalta las coincidencias en un texto
 */
export const highlightMatches = (text: string, query: string): string => {
  if (!query.trim()) return text;

  const normalizedQuery = normalizeForSearch(query);
  const words = normalizedQuery.split(/\s+/);
  let result = text;

  for (const word of words) {
    const regex = new RegExp(`(${word})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  }

  return result;
};

/**
 * Extrae términos de búsqueda relevantes de un producto
 */
export const extractSearchTerms = (product: {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  sku?: string;
  features?: string[];
}): string[] => {
  const terms: string[] = [];

  if (product.name) terms.push(product.name);
  if (product.brand) terms.push(product.brand);
  if (product.category) terms.push(product.category);
  if (product.sku) terms.push(product.sku);
  if (product.description) {
    // Extraer palabras clave de la descripción (palabras de más de 3 letras)
    const words = product.description
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 10);
    terms.push(...words);
  }
  if (product.features) {
    terms.push(...product.features);
  }

  return terms;
};

/**
 * Calcula un score de relevancia para un producto dado una query
 */
export const calculateRelevanceScore = (
  query: string,
  product: {
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    sku?: string;
  }
): number => {
  const normalizedQuery = normalizeForSearch(query);
  let score = 0;

  // Coincidencia en nombre (peso más alto)
  if (product.name) {
    const nameSimilarity = stringSimilarity(normalizedQuery, normalizeForSearch(product.name));
    score += nameSimilarity * 10;

    // Bonus por coincidencia exacta
    if (normalizeForSearch(product.name).includes(normalizedQuery)) {
      score += 5;
    }
  }

  // Coincidencia en marca
  if (product.brand) {
    const brandSimilarity = stringSimilarity(normalizedQuery, normalizeForSearch(product.brand));
    score += brandSimilarity * 3;
  }

  // Coincidencia en categoría
  if (product.category) {
    const categorySimilarity = stringSimilarity(
      normalizedQuery,
      normalizeForSearch(product.category)
    );
    score += categorySimilarity * 2;
  }

  // Coincidencia en SKU
  if (product.sku) {
    const skuSimilarity = stringSimilarity(normalizedQuery, normalizeForSearch(product.sku));
    score += skuSimilarity * 4;
  }

  // Coincidencia en descripción (peso bajo)
  if (product.description) {
    if (normalizeForSearch(product.description).includes(normalizedQuery)) {
      score += 1;
    }
  }

  return score;
};
