import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../api/bookService';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import { Search, BookCopy, Filter } from 'lucide-react';

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'unavailable'

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    // Filter books based on search term and availability filter
    let results = books;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        book => 
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.description.toLowerCase().includes(term)
      );
    }
    
    if (filter === 'available') {
      results = results.filter(book => book.available > 0);
    } else if (filter === 'unavailable') {
      results = results.filter(book => book.available === 0);
    }
    
    setFilteredBooks(results);
  }, [searchTerm, filter, books]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 rounded-lg shadow-md mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Library Collection</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Explore our extensive collection of books. Filter by availability or search for your favorite titles.
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, author or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full py-3 pl-10 pr-4 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Filter */}
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="w-full md:w-48 py-3 pl-10 pr-4 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Books</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Not Available</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
              {searchTerm && <span> for "{searchTerm}"</span>}
              {filter !== 'all' && <span> filtered by {filter}</span>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BookCopy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500 mb-8">
              {searchTerm 
                ? `No results for "${searchTerm}". Try a different search term.` 
                : 'There are no books that match your current filters.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;