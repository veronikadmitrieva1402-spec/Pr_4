import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const api = {
    getBooks: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const url = params ? `/books?${params}` : '/books';
        const response = await apiClient.get(url);
        return response.data;
    },

    getBookById: async (id) => {
        const response = await apiClient.get(`/books/${id}`);
        return response.data;
    },

    createBook: async (book) => {
        const response = await apiClient.post('/books', book);
        return response.data;
    },

    updateBook: async (id, book) => {
        const response = await apiClient.patch(`/books/${id}`, book);
        return response.data;
    },

    deleteBook: async (id) => {
        const response = await apiClient.delete(`/books/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    getAuthors: async () => {
        const response = await apiClient.get('/authors');
        return response.data;
    }
};