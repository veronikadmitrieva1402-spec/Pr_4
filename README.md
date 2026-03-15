# Книжный интернет магазин

Было реализовано веб-приложение интернет-магазина книг с возможностью просмотра каталога, добавления, редактирования и удаления книг. Проект включает в себя backend(Express) и frontend(React) с документацией API через Swagger.

## Backend
- **Node.js** - среда выполнения JavaScript
- **Express.js**-веб-фреймворк
- **nanoid**-генерация уникальных идентификаторов
- **cors**-middleware для CORS
- **swagger-jsdoc**, **swagger-ui-express** - документация API

## Frontend
- **React** - библиотека для пользовательских интерфейсов
- **Axios** - HTTP клиент
- **Sass** - препроцессор CSS

## Функции

### Backend API
- Получение списка всех книг (с фильтрацией)
- Получение книги по ID
- Создание новой книги
- Обновление данных книги
- Удаление книги
- Получение списка категорий
- Получение списка авторов
- Интерактивная документация Swagger

### Frontend
- Просмотр каталога книг
- Фильтрация по категории, автору, цене, наличию
- Добавление новой книги
- Редактирование существующей книги
- Удаление книги
- Адаптивный дизайн

## Установка и запуск

### Backend
1. git init - Создание пустого репозитория
2. cd backend - Переход в папку backend
3. npm install - Установка зависимостей
4. npm run dev - Запуск сервера

### Frontend
1. cd fronend - Переход в папку fronend
2. npm install - Установка зависимостей
3. npm start - Запуск React

## Проверка работы

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000/api/books
- **Swagger документация:** http://localhost:3000/api-docs

## Book

Get -> `/api/books/'` -> Получить все книги (с фильтрацией)
Get -> `/api/books/{id}` -> Получить книгу по ID
Post -> `/api/books` -> Создать новую книгу
Patch -> `/api/books/{id}` -> Обновить книгу
Delete -> `/api/books/{id}` -> Удалить книгу
Get -> `/api/categories` -> Получить список категорий
Get -> `/api/authors` -> Получить список авторов

## Схема книги
```json
{
     "id": "string",
  "name": "string",
  "category": "string",
  "author": "string",
  "description": "string",
  "price": "number",
  "stock": "integer",
  "rating": "number",
  "year": "integer",
  "pages": "integer",
  "image": "string"
}
```

## Фильтрация книг
Get`/api/books`:
- `category` - фильтр по категории
- `author` - фильтр по автору
- `minPrice` - минимальная цена
- `maxPrice` - максимальная цена
- `inStock` - только в наличии

