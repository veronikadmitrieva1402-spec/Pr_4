import React, { useEffect, useState } from 'react';

export default function ProductModal({
    open,
    mode,
    initialBook,
    categories,
    authors,
    onClose,
    onSubmit
}) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        author: '',
        description: '',
        price: '',
        stock: '',
        rating: '',
        year: '',
        pages: '',
        image: ''
    });

    useEffect(() => {
        if (!open) return;

        if (initialBook) {
            setFormData({
                name: initialBook.name || '',
                category: initialBook.category || '',
                author: initialBook.author || '',
                description: initialBook.description || '',
                price: String(initialBook.price || ''),
                stock: String(initialBook.stock || ''),
                rating: String(initialBook.rating || ''),
                year: String(initialBook.year || ''),
                pages: String(initialBook.pages || ''),
                image: initialBook.image || ''
            });
        } else {
            setFormData({
                name: '',
                category: categories[0] || '',
                author: '',
                description: '',
                price: '',
                stock: '',
                rating: '0',
                year: '',
                pages: '',
                image: ''
            });
        }
    }, [open, initialBook, categories]);

    if (!open) return null;

    const title = mode === 'edit' ? 'Редактирование книги' : 'Добавление книги';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Введите название книги');
            return;
        }

        if (!formData.category) {
            alert('Выберите категорию');
            return;
        }

        if (!formData.author.trim()) {
            alert('Введите автора');
            return;
        }

        if (!formData.description.trim()) {
            alert('Введите описание книги');
            return;
        }

        const price = Number(formData.price);
        if (!Number.isFinite(price) || price <= 0) {
            alert('Введите корректную цену');
            return;
        }

        const stock = Number(formData.stock);
        if (!Number.isInteger(stock) || stock < 0) {
            alert('Введите корректное количество на складе');
            return;
        }

        const rating = Number(formData.rating);
        if (rating < 0 || rating > 5) {
            alert('Рейтинг должен быть от 0 до 5');
            return;
        }

        onSubmit({
            id: initialBook?.id,
            name: formData.name.trim(),
            category: formData.category,
            author: formData.author.trim(),
            description: formData.description.trim(),
            price: price,
            stock: stock,
            rating: rating,
            year: formData.year ? Number(formData.year) : null,
            pages: formData.pages ? Number(formData.pages) : null,
            image: formData.image || `https://via.placeholder.com/200/6366f1/ffffff?text=${encodeURIComponent(formData.name)}`
        });
    };

    return (
        <div className="backdrop" onClick={onClose}>
            <div className="modal modal--large" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <button className="modal__close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal__body">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Название книги *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Например: Мастер и Маргарита"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Автор *</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    placeholder="Например: Михаил Булгаков"
                                    list="authors"
                                />
                                <datalist id="authors">
                                    {authors.map(author => (
                                        <option key={author} value={author} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Категория *</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Год издания</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    placeholder="1967"
                                    min="1000"
                                    max={new Date().getFullYear()}
                                />
                            </div>

                            <div className="form-group">
                                <label>Количество страниц</label>
                                <input
                                    type="number"
                                    name="pages"
                                    value={formData.pages}
                                    onChange={handleChange}
                                    placeholder="480"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Описание *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Краткое описание книги"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Цена (₽) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Количество на складе *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Рейтинг (0-5)</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>URL изображения</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === 'edit' ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}