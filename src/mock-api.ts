import {Book} from "./task1-types";

const STORAGE_KEY = 'catalog';

const DEFAULT_BOOKS: Book[] = [
    { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
    { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
];

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchBooks(): Promise<Book[]> {
    await delay(800);

    if (Math.random() < 0.2) {
        throw new Error('Сбой сети. Не удалось загрузить книги.');
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return DEFAULT_BOOKS;
    }

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (parsed && Array.isArray(parsed.books)) {
            return parsed.books;
        }
        return [];
    } catch {
        return [];
    }
}

export async function saveBooks(books: Book[]): Promise<void> {
    await delay(500);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}