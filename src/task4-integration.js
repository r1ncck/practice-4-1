// Задание 4: Интеграция с DOM (Парсинг сырых данных)
// Преобразование данных из HTML-формы в строго типизированный объект
export function createBookFromForm(formData) {
    // Получение сырых значений полей формы
    const titleRaw = formData.get("title");
    const authorsRaw = formData.get("authors");
    const yearRaw = formData.get("year");
    const ratingRaw = formData.get("rating");
    //Обработка авторов
    const authors = authorsRaw
        .split(",")
        .map((author) => author.trim())
        .filter((author) => author.length > 0);
    // Преобразование года
    const year = yearRaw ? parseInt(yearRaw, 10) : undefined;
    // Преобразование и валидация рейтинга
    let rating = undefined;
    if (ratingRaw) {
        rating = parseFloat(ratingRaw);
        // Бизнес-правило: рейтинг строго от 0 до 5
        if (rating < 0 || rating > 5) {
            throw new Error("Рейтинг должен быть числом от 0 до 5");
        }
    }
    // Генерация уникального ID и возврат итогового объекта Book
    return {
        id: crypto.randomUUID(), // Генерируем уникальный строковый идентификатор
        title: titleRaw,
        authors: authors,
        year: year,
        rating: rating,
    };
}
