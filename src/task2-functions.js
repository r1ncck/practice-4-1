/**
 * Функции работы с каталогом в функциональном стиле.
 *
 * @deprecated весь модуль заменён классом `BookCatalog` (практика 3.1).
 *             Сохранён для ознакомления и сравнения подходов:
 *             функциональный (этот файл) vs ООП (task6-classes.ts).
 *             В будущем может быть удалён или перемещён в examples/.
 */
/**
 * Добавляет книгу в каталог иммутабельно (возвращает новый объект).
 * @deprecated используйте `BookCatalog.addBook()`
 */
export function addBook(catalog, book) {
    return {
        ...catalog,
        [book.id]: book,
    };
}
/**
 * Удаляет книгу из каталога по id.
 * @deprecated используйте `BookCatalog.removeBook()`
 */
export function removeBook(catalog, id) {
    const { [id]: _, ...rest } = catalog;
    return rest;
}
/**
 * Возвращает книгу по id или undefined.
 * @deprecated логика перенесена в методы класса BookCatalog
 */
export function getBook(catalog, id) {
    return catalog[id];
}
