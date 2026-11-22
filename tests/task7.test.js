import { describe, it, expect } from "vitest";
import { Wishlist } from "../src/task7-wishlist";
import { BookCatalog } from "../src/task6-classes";
describe("Класс Wishlist", () => {
    const testBooks = [
        { id: "1", title: "TypeScript Guide", authors: ["John Doe"], year: 2024 },
        { id: "2", title: "JavaScript Basics", authors: ["Jane Smith"], year: 2022 },
        { id: "3", title: "Advanced TypeScript", authors: ["John Doe"], year: 2023 },
    ];
    describe("toggle и has", () => {
        it("должен добавлять id при первом вызове toggle", () => {
            const wishlist = new Wishlist();
            wishlist.toggle("1");
            expect(wishlist.has("1")).toBe(true);
            expect(wishlist.count).toBe(1);
        });
        it("должен удалять id при повторном вызове toggle", () => {
            const wishlist = new Wishlist();
            wishlist.toggle("1");
            wishlist.toggle("1");
            expect(wishlist.has("1")).toBe(false);
            expect(wishlist.count).toBe(0);
        });
        it("должен работать с несколькими id", () => {
            const wishlist = new Wishlist();
            wishlist.toggle("1");
            wishlist.toggle("2");
            expect(wishlist.has("1")).toBe(true);
            expect(wishlist.has("2")).toBe(true);
            expect(wishlist.count).toBe(2);
        });
    });
    describe("getFavorites (композиция)", () => {
        it("должен возвращать пустой массив, если вишлист пуст", () => {
            const wishlist = new Wishlist();
            const catalog = new BookCatalog("main", testBooks);
            expect(wishlist.getFavorites(catalog)).toEqual([]);
        });
        it("должен возвращать только избранные книги", () => {
            const wishlist = new Wishlist();
            wishlist.toggle("1");
            wishlist.toggle("3");
            const catalog = new BookCatalog("main", testBooks);
            const favorites = wishlist.getFavorites(catalog);
            expect(favorites.length).toBe(2);
            expect(favorites.map(b => b.id)).toEqual(["1", "3"]);
        });
        it("должен автоматически исключать удалённые из каталога книги", () => {
            const wishlist = new Wishlist();
            wishlist.toggle("1");
            const catalog = new BookCatalog("main", [...testBooks]);
            catalog.removeBook("1");
            expect(wishlist.getFavorites(catalog).length).toBe(0);
        });
        it("должен возвращать книги в порядке их появления в каталоге", () => {
            const wishlist = new Wishlist();
            wishlist.toggle("3");
            wishlist.toggle("1"); // добавили в обратном порядке
            const catalog = new BookCatalog("main", testBooks);
            const favorites = wishlist.getFavorites(catalog);
            // Порядок определяется каталогом, а не вишлистом
            expect(favorites.map(b => b.id)).toEqual(["1", "3"]);
        });
    });
});
