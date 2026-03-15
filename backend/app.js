const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const booksData = require('./data/products');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

let books = [...booksData];

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API книжного магазина',
            version: '1.0.0',
            description: 'API для управления каталогом книг',
        },
        servers: [
            {
                url: `http://localhost:${port}/api`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - author
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный ID книги
 *         name:
 *           type: string
 *           description: Название книги
 *         category:
 *           type: string
 *           description: Категория книги
 *         author:
 *           type: string
 *           description: Автор книги
 *         description:
 *           type: string
 *           description: Описание книги
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг книги (0-5)
 *         year:
 *           type: integer
 *           description: Год издания
 *         pages:
 *           type: integer
 *           description: Количество страниц
 *         image:
 *           type: string
 *           description: URL изображения
 *       example:
 *         id: "abc123"
 *         name: "Мастер и Маргарита"
 *         category: "Классика"
 *         author: "Михаил Булгаков"
 *         description: "Великий роман о визите дьявола в Москву"
 *         price: 650
 *         stock: 15
 *         rating: 4.9
 *         year: 1967
 *         pages: 480
 *         image: "https://via.placeholder.com/200"
 */

function findBookOr404(id, res) {
    const book = books.find(b => b.id === id);
    if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return null;
    }
    return book;
}

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Управление книгами
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Создает новую книгу
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - author
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               year:
 *                 type: integer
 *               pages:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Книга успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Ошибка валидации
 */

app.post('/api/books', (req, res) => {
    const { name, category, description, price, stock, rating, author, year, pages, image } = req.body;

    if (!name || !category || !description || !price || stock === undefined || !author) {
        return res.status(400).json({ error: 'Missing' });
    }

    const newBook = {
        id: nanoid(8),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        rating: rating ? Number(rating) : 0,
        author: author.trim(),
        year: year ? Number(year) : null,
        pages: pages ? Number(pages) : null,
        image: image
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Возвращает список всех книг
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Фильтр по категории
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Фильтр по автору
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Минимальная цена
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Максимальная цена
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Только в наличии
 *     responses:
 *       200:
 *         description: Список книг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

app.get('/api/books', (req, res) => {
    const { category, author, minPrice, maxPrice, inStock } = req.query;
    let filteredBooks = [...books];

    if (category) {
        filteredBooks = filteredBooks.filter(b => b.category === category);
    }

    if (author) {
        filteredBooks = filteredBooks.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
    }

    if (minPrice) {
        filteredBooks = filteredBooks.filter(b => b.price >= Number(minPrice));
    }

    if (maxPrice) {
        filteredBooks = filteredBooks.filter(b => b.price <= Number(maxPrice));
    }

    if (inStock === 'true') {
        filteredBooks = filteredBooks.filter(b => b.stock > 0);
    }
    res.json(filteredBooks);
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Получает книгу по ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID книги
 *     responses:
 *       200:
 *         description: Данные книги
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Книга не найдена
 */

app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const book = findBookOr404(id, res);
    if (!book) return;
    res.json(book);
});

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Обновляет данные книги
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID книги
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               year:
 *                 type: integer
 *               pages:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленная книга
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Нет полей для обновления
 *       404:
 *         description: Книга не найдена
 */

app.patch('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const book = findBookOr404(id, res);
    if (!book) return;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Nothing to update' });
    }

    const { name, category, description, price, stock, rating, author, year, pages, image } = req.body;

    if (name !== undefined) book.name = name.trim();
    if (category !== undefined) book.category = category.trim();
    if (description !== undefined) book.description = description.trim();
    if (price !== undefined) book.price = Number(price);
    if (stock !== undefined) book.stock = Number(stock);
    if (rating !== undefined) book.rating = Number(rating);
    if (author !== undefined) book.author = author.trim();
    if (year !== undefined) book.year = year ? Number(year) : null;
    if (pages !== undefined) book.pages = pages ? Number(pages) : null;
    if (image !== undefined) book.image = image;

    res.json(book);
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Удаляет книгу
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID книги
 *     responses:
 *       204:
 *         description: Книга успешно удалена
 *       404:
 *         description: Книга не найдена
 */

app.delete('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const exists = books.some(b => b.id === id);

    if (!exists) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books = books.filter(b => b.id !== id);
    res.status(204).send();
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Возвращает список всех категорий
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

app.get('/api/categories', (req, res) => {
    const categories = [...new Set(books.map(b => b.category))];
    res.json(categories);
});

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Возвращает список всех авторов
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Список авторов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

app.get('/api/authors', (req, res) => {
    const authors = [...new Set(books.map(b => b.author))];
    res.json(authors);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});


app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Книжный магазин API запущен на http://localhost:${port}`);
});
