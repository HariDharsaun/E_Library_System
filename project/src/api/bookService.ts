import apiClient from './apiClient';
import { Book, Transaction } from '../types';

// Get all books
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get('/books');
  return response.data;
};

// Get book by ID
export const getBookById = async (id: string): Promise<Book> => {
  const response = await apiClient.get(`/books/${id}`);
  return response.data;
};

// Add book (admin only)
export const addBook = async (bookData: Partial<Book>): Promise<Book> => {
  const response = await apiClient.post('/books', bookData);
  return response.data.book;
};

// Update book (admin only)
export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  const response = await apiClient.put(`/books/${id}`, bookData);
  return response.data.book;
};

// Delete book (admin only)
export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete(`/books/${id}`);
};

// Purchase book
export const purchaseBook = async (bookId: string): Promise<Transaction> => {
  const response = await apiClient.post('/books/purchase', { bookId });
  return response.data.transaction;
};

// Return book
export const returnBook = async (transactionId: string): Promise<Transaction> => {
  const response = await apiClient.post('/books/return', { transactionId });
  return response.data.transaction;
};

// Get user's current books
export const getUserBooks = async (): Promise<Transaction[]> => {
  const response = await apiClient.get('/books/user/books');
  return response.data;
};

// Pay fine
export const payFine = async (transactionId: string): Promise<Transaction> => {
  const response = await apiClient.post('/books/pay-fine', { transactionId });
  return response.data.transaction;
};