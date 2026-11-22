import { describe, it, expect } from "vitest";
import { createBookFromForm } from "../src/task4-integration";
describe("Task 4: Интеграция с DOM", () => {
    it("createBookFromForm должен создавать книгу из FormData", () => {
        const formData = new FormData();
        formData.append("title", "New Book");
        formData.append("authors", "Author One, Author Two");
        formData.append("year", "2024");
        formData.append("rating", "4.5");
        const book = createBookFromForm(formData);
        expect(book.title).toBe("New Book");
        expect(book.authors).toEqual(["Author One", "Author Two"]);
        expect(book.year).toBe(2024);
        expect(book.rating).toBe(4.5);
        expect(typeof book.id).toBe("string");
        expect(book.id.length).toBeGreaterThan(0);
    });
    it("createBookFromForm должен работать без опциональных полей", () => {
        const formData = new FormData();
        formData.append("title", "Minimal Book");
        formData.append("authors", "Solo Author");
        const book = createBookFromForm(formData);
        expect(book.title).toBe("Minimal Book");
        expect(book.authors).toEqual(["Solo Author"]);
        expect(book.year).toBeUndefined();
        expect(book.rating).toBeUndefined();
    });
    it("createBookFromForm должен генерировать уникальный id", () => {
        const formData1 = new FormData();
        formData1.append("title", "Book 1");
        formData1.append("authors", "A");
        const formData2 = new FormData();
        formData2.append("title", "Book 2");
        formData2.append("authors", "B");
        const book1 = createBookFromForm(formData1);
        const book2 = createBookFromForm(formData2);
        expect(book1.id).not.toBe(book2.id);
    });
    it("createBookFromForm должен преобразовывать year и rating в числа", () => {
        const formData = new FormData();
        formData.append("title", "Test");
        formData.append("authors", "Test Author");
        formData.append("year", "2020");
        formData.append("rating", "3.5");
        const book = createBookFromForm(formData);
        expect(typeof book.year).toBe("number");
        expect(book.year).toBe(2020);
        expect(typeof book.rating).toBe("number");
        expect(book.rating).toBe(3.5);
    });
    it("createBookFromForm должен выбрасывать ошибку при рейтинге > 5", () => {
        const formData = new FormData();
        formData.append("title", "Test");
        formData.append("authors", "Test Author");
        formData.append("rating", "6.0");
        expect(() => createBookFromForm(formData)).toThrow("Рейтинг должен быть числом от 0 до 5");
    });
    it("createBookFromForm должен выбрасывать ошибку при рейтинге < 0", () => {
        const formData = new FormData();
        formData.append("title", "Test");
        formData.append("authors", "Test Author");
        formData.append("rating", "-1");
        expect(() => createBookFromForm(formData)).toThrow("Рейтинг должен быть числом от 0 до 5");
    });
});
