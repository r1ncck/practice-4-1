// ============================================================
// Практика 3: Классы и ООП
// ============================================================
// Цель: заменить функциональный каталог из Практик 2.1–2.2
// на класс с состоянием.
//
// Проверка: npm test -- task6
// ============================================================
import { filterByTitle, sortBooks } from "./task5-utils";
/*
  Реализуйте класс BookCatalog.

  Состояние:
    - books: Book[]        — приватное, снаружи недоступно
    - id: string           — readonly

  Конструктор: (id: string, books: Book[] = [])

  Публичный API:
    addBook(book: Book): void
    removeBook(id: string): void
    getBooks(): Book[]
    searchByTitle(query: string): Book[]
    sortBy(sortType: 'year' | 'rating'): Book[]
    get count(): number

  Требования:
    - addBook / removeBook не мутируют массив, а создают новый
    - searchByTitle и sortBy переиспользуют filterByTitle / sortBooks
    - внешний код не может присвоить this.books напрямую

  Бонус: класс Book с полями id, title, authors, year?, rating?,
  методом format() и статическим createFromFormData(FormData).
*/
export class BookCatalog {
    constructor(id, books = []) {
        this.id = id;
        this.books = books;
    }
    addBook(book) {
        this.books = [...this.books, book];
    }
    removeBook(id) {
        this.books = this.books.filter(b => b.id !== id);
    }
    getBooks() {
        return this.books;
    }
    get count() {
        return this.books.length;
    }
    searchByTitle(query) {
        return this.books.filter(filterByTitle(query));
    }
    sortBy(sortType) {
        return sortBooks(this.books, sortType);
    }
}
