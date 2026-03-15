import React, { useState, useEffect } from 'react';
import './ProductsPage.scss';
import ProductList from '../../components/ProductList';
import ProductModal from '../../components/ProductModal';
import ProductFilter from '../../components/ProductFilter';
import { api } from '../../api';

export default function ProductsPage() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        author: '',
        minPrice: '',
        maxPrice: '',
        inStock: false
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        loadBooks();
        loadCategories();
        loadAuthors();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [books, filters]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await api.getBooks();
            setBooks(data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки книг');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadAuthors = async () => {
        try {
            const data = await api.getAuthors();
            setAuthors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const applyFilters = () => {
        let filtered = [...books];

        if (filters.category) {
            filtered = filtered.filter(b => b.category === filters.category);
        }

        if (filters.author) {
            filtered = filtered.filter(b =>
                b.author.toLowerCase().includes(filters.author.toLowerCase())
            );
        }

        if (filters.minPrice) {
            filtered = filtered.filter(b => b.price >= Number(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(b => b.price <= Number(filters.maxPrice));
        }

        if (filters.inStock) {
            filtered = filtered.filter(b => b.stock > 0);
        }

        setFilteredBooks(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const openCreate = () => {
        setModalMode('create');
        setEditingBook(null);
        setModalOpen(true);
    };

    const openEdit = (book) => {
        setModalMode('edit');
        setEditingBook(book);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingBook(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm('Удалить книгу?');
        if (!ok) return;

        try {
            await api.deleteBook(id);
            setBooks(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            console.error(err);
            alert('Ошибка удаления книги');
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === 'create') {
                const newBook = await api.createBook(payload);
                setBooks(prev => [...prev, newBook]);
            } else {
                const updatedBook = await api.updateBook(payload.id, payload);
                setBooks(prev =>
                    prev.map(b => b.id === payload.id ? updatedBook : b)
                );
            }
            closeModal();
            loadCategories();
            loadAuthors();
        } catch (err) {
            console.error(err);
            alert('Ошибка сохранения книги');
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="header__right">Интернет-магазин книг</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Каталог книг</h1>
                        <button className="btn btn--primary" onClick={openCreate}>
                            + Добавить книгу
                        </button>
                    </div>

                    <ProductFilter
                        categories={categories}
                        authors={authors}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />

                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="empty">Книги не найдены</div>
                    ) : (
                        <ProductList
                            books={filteredBooks}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} BookStore. Все права защищены.
                </div>
            </footer>

            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialBook={editingBook}
                categories={categories}
                authors={authors}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
}