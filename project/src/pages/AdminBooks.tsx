import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks, addBook, updateBook, deleteBook } from '../api/bookService';
import { Book } from '../types';
import BookForm from '../components/BookForm';
import { Edit, Trash2, Plus, ChevronLeft, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData: Partial<Book>) => {
    try {
      await addBook(bookData);
      setShowAddForm(false);
      toast.success('Book added successfully');
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
    }
  };

  const handleUpdateBook = async (bookData: Partial<Book>) => {
    if (!editingBook?._id) return;

    try {
      await updateBook(editingBook._id, bookData);
      setEditingBook(null);
      toast.success('Book updated successfully');
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      setConfirmDelete(null);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="text-blue-600 hover:text-blue-800 mr-4">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
      </div>
      
      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Add Book Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>
      
      {/* Add Book Form */}
      {showAddForm && (
        <div className="mb-8">
          <BookForm
            onSubmit={handleAddBook}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
      
      {/* Edit Book Form */}
      {editingBook && (
        <div className="mb-8">
          <BookForm
            book={editingBook}
            onSubmit={handleUpdateBook}
            onCancel={() => setEditingBook(null)}
          />
        </div>
      )}
      
      {/* Books Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map(book => (
                  <tr key={book._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={book.coverImage || "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"}
                            alt={book.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.isbn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.available}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {book.available > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingBook(book)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(book._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        
                        {/* Delete Confirmation Dialog */}
                        {confirmDelete === book._id && (
                          <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-3 z-10 w-64">
                            <div className="flex items-center text-red-600 mb-2">
                              <AlertCircle className="h-5 w-5 mr-2" />
                              <span className="font-semibold">Confirm Delete</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Are you sure you want to delete "{book.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteBook(book._id)}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? `No results for "${searchTerm}"` : 'There are no books in the library yet.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setShowAddForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Book
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;