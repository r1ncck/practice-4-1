import './styles.css';
import { AsyncState, Book } from './task1-types';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from "./task4-integration";
import { filterByTitle, sortBooks } from './task5-utils';
import { BookCatalog } from './task6-classes';
import { Wishlist } from './task7-wishlist';
import { fetchBooks, saveBook, deleteBook } from './api';

// ============================================================
// ИСХОДНОЕ СОСТОЯНИЕ
// ============================================================
let state: AsyncState<Book[]> = { status: 'loading' };
let errorMessage = '';

let catalog = new BookCatalog('main', []);
let wishlist = new Wishlist();

const savedWishlist = localStorage.getItem('wishlist');
if (savedWishlist) {
  wishlist = new Wishlist(JSON.parse(savedWishlist));
}

function saveWishlist(): void {
  localStorage.setItem('wishlist', JSON.stringify(wishlist.getFavoriteIds()));
}

function showTemporaryError(error: unknown): void {
  errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
  render();
  setTimeout(() => { errorMessage = ''; render(); }, 3000);
}

// ============================================================
// DOM-элементы
// ============================================================
const bookList = document.querySelector('#bookList') as HTMLDivElement;
const wishlistContainer = document.querySelector('#wishlistContainer') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessageEl = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;

// ============================================================
// СОЗДАНИЕ КАРТОЧКИ
// ============================================================
function createBookCard(book: Book): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = `${book.title} — ${book.authors.join(', ')}${book.year ? `, ${book.year}` : ''}`;
  card.append(titleEl);

  if (book.rating !== undefined) {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Рейтинг: ${book.rating}`;
    card.append(ratingEl);
  }

  // Кнопка «Удалить»
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', async () => {
    if (state.status !== 'success') return;

    const rest = state.data.filter(b => b.id !== book.id);
    try {
      await deleteBook(book.id);
      catalog.removeBook(book.id);
      state = { status: 'success', data: rest };
      render();
    } catch (error) {
      showTemporaryError(error);
    }
  });
  card.append(deleteBtn);


  // Кнопка «Избранное» 
  const favBtn = document.createElement('button');
  favBtn.textContent = wishlist.has(book.id) ? '❤️ В избранном' : '🤍 В избранное';
  favBtn.addEventListener('click', () => {
    wishlist.toggle(book.id);
    saveWishlist();
    render();
  });
  card.append(favBtn);

  return card;
}

// ============================================================
// ОТРИСОВКА
// ============================================================
function renderBooks(books: Book[]) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    bookList.append(createBookCard(book));
  });
}

function renderWishlist() {
  wishlistContainer.innerHTML = '';
  const favBooks = wishlist.getFavorites(catalog);

  if (favBooks.length === 0) {
    wishlistContainer.textContent = 'Пока ничего не добавлено';
    return;
  }

  favBooks.forEach(book => {
    wishlistContainer.append(createBookCard(book));
  });
}

// Единая функция обновления вида
function updateView(books: Book []) {
  catalog = new BookCatalog('main', books);

  const filters: ((book: Book) => boolean)[] = [];
  if (authorInput.value.trim()) filters.push(filterByAuthor(authorInput.value.trim()));
  if (yearInput.value.trim()) filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
  if (searchInput.value.trim()) filters.push(filterByTitle(searchInput.value.trim()));

  const allBooks = catalog.getBooks();
  const filtered = applyFilters(allBooks, filters);
  const sorted = sortBooks(filtered, sortBySelect.value as 'year' | 'rating');

  renderBooks(sorted);
  renderWishlist();
}

function render() {
  errorMessageEl.textContent = errorMessage;

  switch (state.status) {
    case 'idle':
      bookList.innerHTML = '';
      bookList.textContent = 'Начальный экран';
      break;

    case 'loading':
      bookList.innerHTML = '';
      bookList.textContent = 'Загрузка данных...';
      break;

    case 'success':
      updateView(state.data);
      break;

    case 'error': {
      bookList.innerHTML = '';

      const errorBlock = document.createElement('div');
      errorBlock.style.color = 'red';

      const msgEl = document.createElement('p');
      msgEl.textContent = state.message;

      const retryBtn = document.createElement('button');
      retryBtn.textContent = 'Повторить попытку';
      retryBtn.addEventListener('click', () => {
        initApp();
      });

      errorBlock.append(msgEl, retryBtn);
      bookList.append(errorBlock);
      break;
    }
  }
}

async function initApp() {
  try {
    state = { status: 'loading' };
    render();

    const books = await fetchBooks();
    state = { status: 'success', data: books };
  } catch (error) {
    state = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
  render();
}

initApp();

// ============================================================
// ОБРАБОТЧИК ФОРМЫ
// ============================================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (state.status !== 'success') return;

  let newBook: Book;
  try {
    const formData = new FormData(form);
    newBook = createBookFromForm(formData);
  } catch (error: unknown) {
    showTemporaryError(error);
    return;
  }

  if (state.status !== 'success') return;

  try {
    const savedBook = await saveBook(newBook);
    catalog.addBook(savedBook);
    state = { status: 'success', data: [...state.data, savedBook] };
    form.reset();
    render();
  } catch (error: unknown) {
    showTemporaryError(error);
  }
});

// ============================================================
// ФИЛЬТРЫ И СОРТИРОВКА
// ============================================================
filterBtn.addEventListener('click', render);
searchInput.addEventListener('input', render);
sortBySelect.addEventListener('change', render);