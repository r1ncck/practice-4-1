import { describe, it, expect } from "vitest";
import { filterByAuthor, filterByMinYear, filterByMinRating, applyFilters, } from "../src/task3-filters";
describe("Task 3: Фильтрация", () => {
    const books = [
        { id: "1", title: "TS Guide", authors: ["John Doe", "Jane"], year: 2023, rating: 4.5, },
        { id: "2", title: "JS Basics", authors: ["Alice"], year: 2020, rating: 3.0, },
        { id: "3", title: "Advanced TS", authors: ["John Doe"], year: 2022, rating: 5.0, },
        { id: "4", title: "Old Book", authors: ["Bob"], year: 2015 },
        { id: "5", title: "No Year Book", authors: ["Charlie"] }, // Книга БЕЗ года для теста
    ];
    describe("filterByAuthor", () => {
        it("должен находить книги по имени автора", () => {
            const filter = filterByAuthor("John Doe");
            const result = books.filter(filter);
            expect(result.length).toBe(2);
            expect(result.map((b) => b.id)).toEqual(["1", "3"]);
        });
        it("должен возвращать пустой массив если автор не найден", () => {
            const filter = filterByAuthor("Nobody");
            expect(books.filter(filter).length).toBe(0);
        });
        it("должен работать с частичным совпадением", () => {
            const filter = filterByAuthor("John");
            const result = books.filter(filter);
            expect(result.length).toBe(2);
        });
    });
    describe("filterByMinYear", () => {
        it("должен фильтровать книги по минимальному году", () => {
            const filter = filterByMinYear(2022);
            const result = books.filter(filter);
            expect(result.length).toBe(2);
            expect(result.map((b) => b.id)).toEqual(["1", "3"]);
        });
        it("должен исключать книги без года", () => {
            const filter = filterByMinYear(2000);
            const result = books.filter(filter);
            // Книга с id "5" не имеет года, она должна быть исключена
            expect(result.find((b) => b.id === "5")).toBeUndefined();
            // Книга с id "4" имеет год 2015, она должна быть включена
            expect(result.find((b) => b.id === "4")).toBeDefined();
        });
    });
    describe("filterByMinRating", () => {
        it("должен фильтровать книги по рейтингу", () => {
            const filter = filterByMinRating(4.0);
            const result = books.filter(filter);
            expect(result.length).toBe(2);
            expect(result.map((b) => b.id)).toEqual(["1", "3"]);
        });
        it("должен исключать книги без рейтинга", () => {
            const filter = filterByMinRating(1.0);
            const result = books.filter(filter);
            expect(result.find((b) => b.id === "4")).toBeUndefined();
            expect(result.find((b) => b.id === "5")).toBeUndefined();
        });
    });
    describe("applyFilters", () => {
        it("должен применять несколько фильтров одновременно", () => {
            // Ищем John Doe, но ТОЛЬКО с 2023 года и новее. 
            // Подойдет только книга с id "1" (у книги "3" год 2022)
            const filters = [filterByAuthor("John Doe"), filterByMinYear(2023)];
            const result = applyFilters(books, filters);
            expect(result.length).toBe(1);
            expect(result[0].id).toBe("1");
        });
        it("должен вернуть все книги если фильтров нет", () => {
            const result = applyFilters(books, []);
            expect(result.length).toBe(books.length);
        });
        it("должен вернуть пустой массив если фильтры несовместимы", () => {
            // Ищем книгу с рейтингом 5.0, но написанную после 2023 года. 
            // В наших данных такой нет (у книги с рейтингом 5.0 год 2022).
            const filters = [filterByMinYear(2024), filterByMinRating(5.0)];
            const result = applyFilters(books, filters);
            expect(result.length).toBe(0);
        });
    });
});
