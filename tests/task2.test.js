import { describe, it, expect } from "vitest";
import { addBook, removeBook, getBook } from "../src/task2-functions";
describe("Task 2: Функции работы с каталогом", () => {
    const book1 = { id: "1", title: "Book One", authors: ["Author A"] };
    const book2 = { id: "2", title: "Book Two", authors: ["Author B"], year: 2020 };
    const initialCatalog = {
        "1": book1,
    };
    it("addBook должен добавлять книгу в каталог", () => {
        const newCatalog = addBook(initialCatalog, book2);
        expect(newCatalog["2"]).toEqual(book2);
        expect(newCatalog["1"]).toEqual(book1);
    });
    it("addBook не должен мутировать исходный каталог", () => {
        const newCatalog = addBook(initialCatalog, book2);
        expect("2" in initialCatalog).toBe(false);
        expect(Object.keys(newCatalog).length).toBe(2);
        expect(Object.keys(initialCatalog).length).toBe(1);
    });
    it("removeBook должен удалять книгу по id", () => {
        const catalogWithTwo = { "1": book1, "2": book2 };
        const newCatalog = removeBook(catalogWithTwo, "1");
        expect(newCatalog["1"]).toBeUndefined();
        expect(newCatalog["2"]).toEqual(book2);
    });
    it("removeBook не должен мутировать исходный каталог", () => {
        const catalogWithTwo = { "1": book1, "2": book2 };
        const newCatalog = removeBook(catalogWithTwo, "1");
        expect("1" in catalogWithTwo).toBe(true);
        expect("1" in newCatalog).toBe(false);
    });
    it("removeBook должен вернуть тот же каталог если id не найден", () => {
        const newCatalog = removeBook(initialCatalog, "999");
        expect(newCatalog).toEqual(initialCatalog);
    });
    it("getBook должен находить книгу по id", () => {
        expect(getBook(initialCatalog, "1")).toEqual(book1);
    });
    it("getBook должен вернуть undefined если книга не найдена", () => {
        expect(getBook(initialCatalog, "999")).toBeUndefined();
    });
});
