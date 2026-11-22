import { applyFilters } from "./task3-filters";
// фильтр по названию
export const filterByTitle = (query) => {
    return (book) => book.title.toLowerCase().includes(query.toLowerCase());
};
// сортировка по году или рейтингу (с копированием массива для иммутабельности)
export function sortBooks(books, sortType) {
    if (sortType === "year") {
        return [...books].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    }
    return [...books].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}
/**
 * Композиция фильтрации по названию и сортировки.
 *
 * @param books - массив книг
 * @param query - строка поиска
 * @param sortType - "year" или "rating"
 * @returns отфильтрованный и отсортированный массив
 *
 * @deprecated логика уже развёрнута в `updateView()` в main.ts через
 *             прямое применение filterByTitle + sortBooks. Сохранена
 *             как готовый композиционный паттерн — пригодится при
 *             рефакторинге main.ts на модули (блок 8 курса).
 */
export function filterAndSortBooks(books, query, sortType) {
    const filtered = applyFilters(books, [filterByTitle(query)]);
    return sortBooks(filtered, sortType);
}
