// ============================================================
// Практика 3.2: Вишлист (Избранное)
// ============================================================
// Класс хранит только id книг, а полные данные получает
// из BookCatalog через композицию. Это гарантирует, что
// вишлист всегда показывает актуальное состояние каталога.
// ============================================================
export class Wishlist {
    constructor(favoriteIds = []) {
        this.favoriteIds = [];
        this.favoriteIds = favoriteIds;
    }
    // Иммутабельное переключение: добавляет или удаляет id
    toggle(id) {
        if (this.favoriteIds.includes(id)) {
            this.favoriteIds = this.favoriteIds.filter(i => i !== id);
        }
        else {
            this.favoriteIds = [...this.favoriteIds, id];
        }
    }
    has(id) {
        return this.favoriteIds.includes(id);
    }
    getFavoriteIds() {
        return this.favoriteIds;
    }
    get count() {
        return this.favoriteIds.length;
    }
    // Композиция: получаем полные объекты книг из каталога
    getFavorites(catalog) {
        return catalog.getBooks().filter(book => this.favoriteIds.includes(book.id));
    }
}
