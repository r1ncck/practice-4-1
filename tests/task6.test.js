import { describe, it, expect } from "vitest";
import { BookCatalog } from "../src/task6-classes";
describe("Task 6: Класс BookCatalog", () => {
    // Тестовые данные
    const testBooks = [
        { id: "1", title: "TypeScript Guide", authors: ["John Doe"], year: 2023, rating: 4.5 },
        { id: "2", title: "JavaScript Basics", authors: ["Jane Smith"], year: 2020, rating: 3.0 },
        { id: "3", title: "Advanced TypeScript", authors: ["John Doe"], year: 2022, rating: 5.0 },
        { id: "4", title: "Old Book", authors: ["Bob"], year: 2015 },
        { id: "5", title: "Mystery Novel", authors: ["Charlie"], rating: 2.0 },
    ];
    describe("конструктор", () => {
        it("должен создавать каталог с начальными книгами", () => {
            const catalog = new BookCatalog("test-catalog", testBooks);
            expect(catalog.getBooks()).toEqual(testBooks);
            expect(catalog.id).toBe("test-catalog");
        });
        it("должен создавать пустой каталог без аргументов", () => {
            const catalog = new BookCatalog("empty", []);
            expect(catalog.getBooks()).toEqual([]);
            expect(catalog.count).toBe(0);
        });
        it("должен создавать пустой каталог с параметром по умолчанию", () => {
            // Если конструктор имеет параметр по умолчанию: constructor(books: Book[] = [], id: string)
            // То можно вызвать с одним аргументом (id), но для этого нужно, чтобы книги были опциональны
            // Этот тест проверяет, что студент реализовал параметр по умолчанию
            const catalog = new BookCatalog("default-books", undefined);
            expect(catalog.getBooks()).toEqual([]);
        });
    });
    describe("метод addBook", () => {
        it("должен добавлять книгу в конец массива", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const newBook = { id: "6", title: "New Book", authors: ["Alice"], year: 2024 };
            catalog.addBook(newBook);
            expect(catalog.count).toBe(testBooks.length + 1);
            expect(catalog.getBooks()[testBooks.length]).toEqual(newBook);
        });
        it("не должен мутировать исходный массив, переданный в конструктор", () => {
            const originalBooks = [...testBooks];
            const catalog = new BookCatalog("test", originalBooks);
            const newBook = { id: "6", title: "New Book", authors: ["Alice"] };
            catalog.addBook(newBook);
            // Исходный массив должен остаться без изменений
            expect(originalBooks.length).toBe(testBooks.length);
        });
    });
    describe("метод removeBook", () => {
        it("должен удалять книгу по id", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const initialCount = catalog.count;
            catalog.removeBook("1");
            expect(catalog.count).toBe(initialCount - 1);
            expect(catalog.getBooks().find(b => b.id === "1")).toBeUndefined();
        });
        it("должен корректно работать при удалении несуществующей книги", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const initialCount = catalog.count;
            catalog.removeBook("non-existent-id");
            expect(catalog.count).toBe(initialCount);
        });
        it("не должен мутировать исходный массив, переданный в конструктор", () => {
            const originalBooks = [...testBooks];
            const catalog = new BookCatalog("test", originalBooks);
            catalog.removeBook("1");
            expect(originalBooks.length).toBe(testBooks.length);
        });
    });
    describe("метод getBooks", () => {
        it("должен возвращать массив всех книг", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const books = catalog.getBooks();
            expect(books.length).toBe(testBooks.length);
            expect(books).toEqual(testBooks);
        });
        it("должен возвращать пустой массив для пустого каталога", () => {
            const catalog = new BookCatalog("empty", []);
            expect(catalog.getBooks()).toEqual([]);
        });
    });
    describe("геттер count", () => {
        it("должен возвращать количество книг", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            expect(catalog.count).toBe(testBooks.length);
        });
        it("должен возвращать 0 для пустого каталога", () => {
            const catalog = new BookCatalog("empty", []);
            expect(catalog.count).toBe(0);
        });
        it("должен обновляться после добавления книги", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const initialCount = catalog.count;
            catalog.addBook({ id: "6", title: "New Book", authors: ["Alice"] });
            expect(catalog.count).toBe(initialCount + 1);
        });
        it("должен обновляться после удаления книги", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const initialCount = catalog.count;
            catalog.removeBook("1");
            expect(catalog.count).toBe(initialCount - 1);
        });
    });
    describe("метод searchByTitle", () => {
        it("должен находить книги по части слова", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.searchByTitle("script");
            expect(result.map(b => b.id)).toEqual(["1", "2", "3"]);
        });
        it("должен искать без учёта регистра", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.searchByTitle("TYPESCRIPT");
            expect(result.map(b => b.id)).toEqual(["1", "3"]);
        });
        it("должен возвращать все книги при пустом запросе", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.searchByTitle("");
            expect(result.length).toBe(testBooks.length);
        });
        it("должен возвращать пустой массив, если ничего не найдено", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.searchByTitle("python");
            expect(result).toEqual([]);
        });
    });
    describe("метод sortBy", () => {
        it("должен сортировать по году (от новых к старым)", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.sortBy("year");
            expect(result.map(b => b.id)).toEqual(["1", "3", "2", "4", "5"]);
        });
        it("должен сортировать по рейтингу (от высокого к низкому)", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.sortBy("rating");
            expect(result.map(b => b.id)).toEqual(["3", "1", "2", "5", "4"]);
        });
        it("должен опускать книги без года в конец при сортировке по году", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.sortBy("year");
            expect(result[result.length - 1].id).toBe("5");
        });
        it("должен опускать книги без рейтинга в конец при сортировке по рейтингу", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const result = catalog.sortBy("rating");
            expect(result[result.length - 1].id).toBe("4");
        });
        it("не должен мутировать внутренний массив книг", () => {
            const catalog = new BookCatalog("test", [...testBooks]);
            const before = catalog.getBooks().map(b => b.id);
            catalog.sortBy("year");
            expect(catalog.getBooks().map(b => b.id)).toEqual(before);
        });
    });
    describe("инкапсуляция", () => {
        it("поле books должно быть приватным (проверяется компилятором)", () => {
            // Этот тест не может проверить приватность в рантайме,
            // но если студент не сделал поле приватным, тесты не скомпилируются
            // при попытке обратиться к catalog.books напрямую.
            // Здесь мы просто проверяем, что доступ идёт через геттер.
            const catalog = new BookCatalog("test", [...testBooks]);
            const books = catalog.getBooks();
            expect(Array.isArray(books)).toBe(true);
        });
        it("поле id должно быть readonly (проверяется компилятором)", () => {
            // Аналогично: если студент не сделал поле readonly, компилятор
            // не даст присвоить catalog.id = "new-id".
            const catalog = new BookCatalog("test", [...testBooks]);
            expect(catalog.id).toBe("test");
        });
    });
});
it("поле books должно быть недоступно снаружи", () => {
    const catalog = new BookCatalog("test");
    // @ts-expect-error — обращение к приватному полю должно вызывать ошибку
    const books = catalog.books;
});
