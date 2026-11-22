import {Book} from "./task1-types";

const API_URL = 'https://6b0303aa4a8cad87bd9035e6.mockapi.io/api/books';

interface BookDTO {
  id: string;
  title: string;
  author: string;
  year?: number;
  rating?: number;
}

function mapFromServer(dto: BookDTO): Book {
  return {
    id: dto.id,
    title: dto.title,
    authors: dto.author ? [dto.author] : [],
    year: dto.year,
    rating: dto.rating,
  };
}

function mapToServer(book: Book): BookDTO {
  return {
    id: book.id,
    title: book.title,
    author: book.authors [0] ?? '',
    year: book.year,
    rating: book.rating,
  };
}

export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const dtos: BookDTO[] = await response.json();
  return dtos.map(mapFromServer);
}

export async function saveBook(book: Book): Promise<Book> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(mapToServer(book)),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const dto: BookDTO = await response.json();
  return mapFromServer(dto);
}

export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}