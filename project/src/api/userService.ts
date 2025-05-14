import apiClient from './apiClient';
import { User, Transaction } from '../types';

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};

// Get user transactions
export const getUserTransactions = async (userId?: string): Promise<Transaction[]> => {
  const url = userId ? `/users/${userId}/transactions` : '/users/transactions';
  const response = await apiClient.get(url);
  return response.data;
};

// Get user's pending returns
export const getPendingReturns = async (userId?: string): Promise<Transaction[]> => {
  const url = userId ? `/users/${userId}/pending-returns` : '/users/pending-returns';
  const response = await apiClient.get(url);
  return response.data;
};

// Create admin user
export const createAdmin = async (userData: { name: string; email: string; password: string }): Promise<User> => {
  const response = await apiClient.post('/users/create-admin', userData);
  return response.data.user;
};