import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ books, onEdit, onDelete }) {
    if (!books.length) {
        return <div className="empty">Книги не найдены</div>;
    }

    return (
        <div className="book-grid">
            {books.map(book => (
                <ProductCard
                    key={book.id}
                    book={book}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}