import React from 'react';

export default function ProductCard({ book, onEdit, onDelete }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="book-card">
            <div className="book-card__image">
                <img src={book.image} alt={book.name} />
                {book.stock === 0 && (
                    <div className="book-card__badge">Нет в наличии</div>
                )}
                {book.stock > 0 && book.stock < 3 && (
                    <div className="book-card__badge book-card__badge--warning">
                        Осталось {book.stock} шт.
                    </div>
                )}
            </div>

            <div className="book-card__content">
                <div className="book-card__category">{book.category}</div>
                <h3 className="book-card__title">{book.name}</h3>
                <div className="book-card__author">{book.author}</div>
                <p className="book-card__description">{book.description}</p>

                <div className="book-card__details">
                    {book.year && <span>{book.year} г.</span>}
                    {book.pages && <span>{book.pages} стр.</span>}
                </div>

                <div className="book-card__rating">
                    {'★'.repeat(Math.floor(book.rating))}
                    {'☆'.repeat(5 - Math.floor(book.rating))}
                    <span>{book.rating}</span>
                </div>

                <div className="book-card__price">
                    {formatPrice(book.price)}
                </div>

                <div className="book-card__actions">
                    <button
                        className="btn btn--edit"
                        onClick={() => onEdit(book)}
                    >
                        Редактировать
                    </button>
                    <button
                        className="btn btn--delete"
                        onClick={() => onDelete(book.id)}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}