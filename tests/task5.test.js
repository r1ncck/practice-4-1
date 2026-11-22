import { describe, it, expect } from "vitest";
import { filterAndSortBooks } from "../src/task5-utils";
describe("Task 5: Поиск и сортировка", () => {
    // Тестовые данные. Обратите внимание:
    // - книга "4" БЕЗ рейтинга (проверка ?? 0 в сортировке по рейтингу)
    // - книга "5" БЕЗ года (проверка ?? 0 в сортировке по году)
    // - намеренно НЕТ книг с одинаковым годом или рейтингом, чтобы порядок был однозначным
    const books = [
        { id: "1", title: "TypeScript Guide", authors: ["John Doe"], year: 2023, rating: 4.5 },
        { id: "2", title: "JavaScript Basics", authors: ["Jane Smith"], year: 2020, rating: 3.0 },
        { id: "3", title: "Advanced TypeScript", authors: ["John Doe"], year: 2022, rating: 5.0 },
        { id: "4", title: "Old Book", authors: ["Bob"], year: 2015 },
        { id: "5", title: "Mystery Novel", authors: ["Charlie"], rating: 2.0 },
    ];
    describe("фильтрация по названию", () => {
        it("должен находить книги по части слова", () => {
            // "script" есть в "TypeScript Guide", "JavaScript Basics", "Advanced TypeScript"
            // Сортировка по году (убыв.): 2023 -> 2022 -> 2020
            const result = filterAndSortBooks(books, "script", "year");
            expect(result.map((b) => b.id)).toEqual(["1", "3", "2"]);
        });
        it("должен искать без учёта регистра", () => {
            // "TYPESCRIPT" найдёт только книги 1 и 3 (в "JavaScript" слова "typescript" нет)
            // Сортировка по году (убыв.): 2023 -> 2022
            const result = filterAndSortBooks(books, "TYPESCRIPT", "year");
            expect(result.map((b) => b.id)).toEqual(["1", "3"]);
        });
        it("должен возвращать все книги при пустом запросе", () => {
            const result = filterAndSortBooks(books, "", "year");
            expect(result.length).toBe(5);
        });
        it("должен возвращать пустой массив если ничего не найдено", () => {
            const result = filterAndSortBooks(books, "python", "rating");
            expect(result).toEqual([]);
        });
    });
    describe("сортировка", () => {
        it("должен сортировать по году (от новых к старым)", () => {
            // 2023 (1) -> 2022 (3) -> 2020 (2) -> 2015 (4) -> нет года (5, считаем за 0)
            const result = filterAndSortBooks(books, "", "year");
            expect(result.map((b) => b.id)).toEqual(["1", "3", "2", "4", "5"]);
        });
        it("должен сортировать по рейтингу (от высокого к низкому)", () => {
            // 5.0 (3) -> 4.5 (1) -> 3.0 (2) -> 2.0 (5) -> нет рейтинга (4, считаем за 0)
            const result = filterAndSortBooks(books, "", "rating");
            expect(result.map((b) => b.id)).toEqual(["3", "1", "2", "5", "4"]);
        });
        it("должен опускать книги без года в конец при сортировке по году", () => {
            const result = filterAndSortBooks(books, "", "year");
            expect(result[result.length - 1].id).toBe("5");
        });
        it("должен опускать книги без рейтинга в конец при сортировке по рейтингу", () => {
            const result = filterAndSortBooks(books, "", "rating");
            expect(result[result.length - 1].id).toBe("4");
        });
    });
    describe("совместная работа фильтра и сортировки", () => {
        it("должен сначала фильтровать, затем сортировать", () => {
            // "book" найдёт только "Old Book" (id 4), несмотря на отсутствие рейтинга
            const result = filterAndSortBooks(books, "book", "rating");
            expect(result.length).toBe(1);
            expect(result[0].id).toBe("4");
        });
        it("не должен мутировать исходный массив", () => {
            const before = books.map((b) => b.id);
            filterAndSortBooks(books, "", "year");
            expect(books.map((b) => b.id)).toEqual(before);
        });
    });
});
