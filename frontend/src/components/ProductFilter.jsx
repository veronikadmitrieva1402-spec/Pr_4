import React from 'react';

export default function ProductFilter({ categories, authors, filters, onFilterChange }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onFilterChange({
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleReset = () => {
        onFilterChange({
            category: '',
            author: '',
            minPrice: '',
            maxPrice: '',
            inStock: false
        });
    };

    return (
        <div className="filter-panel">
            <div className="filter-panel__title">Фильтры</div>

            <div className="filter-panel__row">
                <div className="filter-group">
                    <label>Категория</label>
                    <select name="category" value={filters.category} onChange={handleChange}>
                        <option value="">Все категории</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Автор</label>
                    <select name="author" value={filters.author} onChange={handleChange}>
                        <option value="">Все авторы</option>
                        {authors.map(author => (
                            <option key={author} value={author}>{author}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Цена от</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                    />
                </div>

                <div className="filter-group">
                    <label>Цена до</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="5000"
                        min="0"
                    />
                </div>

                <div className="filter-group filter-group--checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={filters.inStock}
                            onChange={handleChange}
                        />
                        Только в наличии
                    </label>
                </div>

                <button className="btn btn--secondary" onClick={handleReset}>
                    Сбросить
                </button>
            </div>
        </div>
    );
}