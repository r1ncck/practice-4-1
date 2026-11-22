import './styles.css';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from "./task4-integration";
import { filterByTitle, sortBooks } from './task5-utils';
import { BookCatalog } from './task6-classes';
import { Wishlist } from './task7-wishlist';
import { fetchBooks, saveBooks } from './mock-api';
// ============================================================
// ИСХОДНОЕ СОСТОЯНИЕ
// ============================================================
let state = { status: 'loading' };
let errorMessage = '';
let catalog = new BookCatalog('main', []);
let wishlist = new Wishlist();
const savedWishlist = localStorage.getItem('wishlist');
if (savedWishlist) {
    wishlist = new Wishlist(JSON.parse(savedWishlist));
}
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist.getFavoriteIds()));
}
// ============================================================
// DOM-элементы
// ============================================================
const bookList = document.querySelector('#bookList');
const wishlistContainer = document.querySelector('#wishlistContainer');
const form = document.querySelector('#bookForm');
const filterBtn = document.querySelector('#applyFilters');
const authorInput = document.querySelector('#filterAuthor');
const yearInput = document.querySelector('#filterYear');
const errorMessageEl = document.querySelector('#errorMessage');
const searchInput = document.querySelector('#searchInput');
const sortBySelect = document.querySelector('#sortBy');
// ============================================================
// СОЗДАНИЕ КАРТОЧКИ
// ============================================================
function createBookCard(book) {
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
        if (state.status !== 'success')
            return;
        const newBooksArray = state.data.filter(b => b.id !== book.id);
        try {
            await saveBooks(newBooksArray);
            state = { status: 'success', data: newBooksArray };
            render();
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            render();
            setTimeout(() => { errorMessage = ''; render(); }, 3000);
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
function renderBooks(books) {
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
function updateView(books) {
    catalog = new BookCatalog('main', books);
    const filters = [];
    if (authorInput.value.trim())
        filters.push(filterByAuthor(authorInput.value.trim()));
    if (yearInput.value.trim())
        filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
    if (searchInput.value.trim())
        filters.push(filterByTitle(searchInput.value.trim()));
    const allBooks = catalog.getBooks();
    const filtered = applyFilters(allBooks, filters);
    const sorted = sortBooks(filtered, sortBySelect.value);
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
    }
    catch (error) {
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
    if (state.status !== 'success')
        return;
    try {
        const formData = new FormData(form);
        const newBook = createBookFromForm(formData);
        const newBooksArray = [...state.data, newBook];
        await saveBooks(newBooksArray);
        state = { status: 'success', data: newBooksArray };
        form.reset();
        render();
    }
    catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        render();
        setTimeout(() => {
            errorMessage = '';
            render();
        }, 3000);
    }
});
// ============================================================
// ФИЛЬТРЫ И СОРТИРОВКА
// ============================================================
filterBtn.addEventListener('click', render);
searchInput.addEventListener('input', render);
sortBySelect.addEventListener('change', render);
