// Задание 1: Интерфейсы и типы
// Описание модели каталога книг

export interface Book {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;
}

// Словарь книг по id — функциональный подход из практики 2
export type Catalog = Record<string, Book>;

export type BookFilter = (book: Book) => boolean;


export type AsyncState<T> = 
| { status: "idle" }
| { status: "loading" }
| { status: "success"; data: T }
| { status: "error"; message: string };

/**
 * Форматирует книгу в строку: "Title (Year) — Authors".
 *
 * @param book - книга для форматирования
 * @returns строка с описанием книги
 *
 * @deprecated пока не используется в UI. В main.ts форматирование
 *             делается через template literal в createBookCard.
 *             Задел на фичу «Консольный вывод / экспорт каталога».
 */
export function formatBook(book: Book): string {
  const yearStr = book.year !== undefined ? ` (${book.year})` : "";
  const authorsStr = book.authors.join(", ");
  return `${book.title}${yearStr} — ${authorsStr}`;
}

/**
 * Вычисляет средний год выпуска книг в переданном массиве.
 *
 * @param books - массив книг
 * @returns средний год (number) или 0, если массив пуст или годов нет
 *
 * @deprecated пока не используется в UI.
 *             Задел на фичу «Статистика каталога» (блок в шапке
 *             страницы со сводными метриками: средний год, количество,
 *             средний рейтинг).
 */
export function calculateAverageYear(books: Book[]): number {
  const booksWithYear = books.filter((book) => book.year !== undefined);

  if (booksWithYear.length === 0) return 0;

  const sum = booksWithYear.reduce(
    (acc, book) => acc + (book.year as number),
    0
  );

  return sum / booksWithYear.length;
}
