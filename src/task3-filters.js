// Задание 3: Фильтрация
// Использование функций высшего порядка и предикатов для поиска данных
// фильтр по имени автора
export const filterByAuthor = (authorName) => {
    return (book) => book.authors.some((author) => author.toLowerCase().includes(authorName.toLowerCase()));
};
// фильтр по минимальному году издания
export const filterByMinYear = (year) => {
    return (book) => book.year !== undefined && book.year >= year;
};
/**
 * Фильтр по минимальному рейтингу.
 *
 * @param rating - пороговое значение рейтинга
 * @returns предикат, проверяющий book.rating >= rating
 *
 * @deprecated пока не используется в UI (нет поля ввода минимального
 *             рейтинга в фильтре). Задел на фичу «Расширенные фильтры»:
 *             добавить `<input id="filterRating">` в блок .filters.
 */
export const filterByMinRating = (rating) => {
    return (book) => book.rating !== undefined && book.rating >= rating;
};
// Применение массива фильтров к массиву книг
export const applyFilters = (books, filters) => {
    return books.filter((book) => filters.every((filter) => filter(book)));
};
