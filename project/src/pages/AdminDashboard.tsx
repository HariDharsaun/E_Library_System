import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks } from '../api/bookService';
import { getAllUsers, getUserTransactions } from '../api/userService';
import { Book, User } from '../types';
import { Users, BookOpen, BookCopy, Clock, ChevronRight, AlertTriangle, DatabaseIcon } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch books
        const booksData = await getAllBooks();
        setBooks(booksData);
        
        // Fetch users
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        // Fetch transactions to count overdue books
        const transactions = await getUserTransactions();
        const today = new Date();
        const overdue = transactions.filter(t => {
          const dueDate = new Date(t.dueDate);
          return t.status === 'issued' && dueDate < today;
        });
        setOverdueBooks(overdue.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalBooks = books.length;
  const availableBooks = books.reduce((total, book) => total + book.available, 0);
  const borrowedBooks = books.reduce((total, book) => total + (book.quantity - book.available), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="flex space-x-3">
          <Link
            to="/admin/books"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            Manage Books
          </Link>
          <Link
            to="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            Manage Users
          </Link>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Books */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookCopy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Total Books</p>
              <p className="text-2xl font-semibold text-gray-800">{totalBooks}</p>
            </div>
          </div>
        </div>
        
        {/* Available Books */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Available</p>
              <p className="text-2xl font-semibold text-gray-800">{availableBooks}</p>
            </div>
          </div>
        </div>
        
        {/* Borrowed Books */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Borrowed</p>
              <p className="text-2xl font-semibold text-gray-800">{borrowedBooks}</p>
            </div>
          </div>
        </div>
        
        {/* Registered Users */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Users</p>
              <p className="text-2xl font-semibold text-gray-800">{users.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attention Required */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Attention Required</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overdue Books */}
          <div className={`border rounded-lg p-4 ${
            overdueBooks > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${
                overdueBooks > 0 ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <AlertTriangle className={`h-6 w-6 ${
                  overdueBooks > 0 ? 'text-red-500' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Overdue Books</h3>
                <p className={`text-sm ${
                  overdueBooks > 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {overdueBooks > 0 
                    ? `${overdueBooks} books are currently overdue` 
                    : 'No overdue books at the moment'}
                </p>
                {overdueBooks > 0 && (
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Check Details <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Low Stock Books */}
          <div className={`border rounded-lg p-4 ${
            books.some(book => book.available === 0) 
              ? 'border-amber-200 bg-amber-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${
                books.some(book => book.available === 0) 
                  ? 'bg-amber-100' 
                  : 'bg-gray-100'
              }`}>
                <DatabaseIcon className={`h-6 w-6 ${
                  books.some(book => book.available === 0) 
                    ? 'text-amber-500' 
                    : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Out of Stock Books</h3>
                <p className={`text-sm ${
                  books.some(book => book.available === 0) 
                    ? 'text-amber-600' 
                    : 'text-gray-500'
                }`}>
                  {books.some(book => book.available === 0)
                    ? `${books.filter(book => book.available === 0).length} books are out of stock`
                    : 'All books are in stock'}
                </p>
                {books.some(book => book.available === 0) && (
                  <Link
                    to="/admin/books"
                    className="inline-flex items-center mt-2 text-sm text-amber-600 hover:text-amber-700"
                  >
                    Manage Inventory <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recently Added Books */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recently Added Books</h2>
            <Link
              to="/admin/books"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {books.length > 0 ? (
              books
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((book) => (
                  <div key={book._id} className="flex items-center border-b border-gray-100 pb-3">
                    <div className="h-12 w-12 rounded overflow-hidden mr-4">
                      <img
                        src={book.coverImage || "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-800">{book.title}</h3>
                      <p className="text-xs text-gray-500">by {book.author}</p>
                    </div>
                    <div className="text-xs text-right">
                      <p className={`font-medium ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available > 0 ? 'Available' : 'Out of Stock'}
                      </p>
                      <p className="text-gray-500">{book.available}/{book.quantity}</p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No books added yet</p>
            )}
          </div>
        </div>
        
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {users.length > 0 ? (
              users
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((user) => (
                  <div key={user.id} className="flex items-center border-b border-gray-100 pb-3">
                    <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-gray-600 font-medium">
                        {user.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-800">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">No users registered yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;