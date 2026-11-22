import { describe, it, expect } from "vitest";
import { formatBook, calculateAverageYear } from "../src/task1-types";
describe("Task 1: Интерфейсы", () => {
    const bookWithYear = {
        id: "1",
        title: "TypeScript Guide",
        authors: ["John Doe", "Jane Smith"],
        year: 2023,
    };
    const bookWithoutYear = {
        id: "2",
        title: "JavaScript Basics",
        authors: ["Alice"],
    };
    const bookWithRating = {
        id: "3",
        title: "Advanced TS",
        authors: ["Bob"],
        year: 2022,
        rating: 4.5,
    };
    it("formatBook должен форматировать книгу с годом", () => {
        expect(formatBook(bookWithYear)).toBe("TypeScript Guide (2023) — John Doe, Jane Smith");
    });
    it("formatBook должен форматировать книгу без года", () => {
        expect(formatBook(bookWithoutYear)).toBe("JavaScript Basics — Alice");
    });
    it("formatBook должен форматировать книгу с рейтингом (рейтинг не выводится)", () => {
        expect(formatBook(bookWithRating)).toBe("Advanced TS (2022) — Bob");
    });
    it("calculateAverageYear должен считать средний год", () => {
        const books = [
            { id: "1", title: "A", authors: ["a"], year: 2020 },
            { id: "2", title: "B", authors: ["b"], year: 2022 },
            { id: "3", title: "C", authors: ["c"], year: 2024 },
        ];
        expect(calculateAverageYear(books)).toBe(2022);
    });
    it("calculateAverageYear должен игнорировать книги без года", () => {
        const books = [
            { id: "1", title: "A", authors: ["a"], year: 2020 },
            { id: "2", title: "B", authors: ["b"] },
            { id: "3", title: "C", authors: ["c"], year: 2024 },
        ];
        expect(calculateAverageYear(books)).toBe(2022);
    });
    it("calculateAverageYear должен вернуть 0 для пустого массива", () => {
        expect(calculateAverageYear([])).toBe(0);
    });
    it("calculateAverageYear должен вернуть 0 если у всех книг нет года", () => {
        const books = [
            { id: "1", title: "A", authors: ["a"] },
            { id: "2", title: "B", authors: ["b"] },
        ];
        expect(calculateAverageYear(books)).toBe(0);
    });
});
