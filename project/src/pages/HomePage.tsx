import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, BookCopy, Clock } from 'lucide-react';
import { getAllBooks } from '../api/bookService';
import { Book } from '../types';
import BookCard from '../components/BookCard';

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const books = await getAllBooks();
        // Get a random selection of up to 3 books
        const randomBooks = books
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setFeaturedBooks(randomBooks);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 rounded-lg shadow-md mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
            Welcome to E-Library
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Your gateway to knowledge. Borrow books, explore new worlds, and expand your horizons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105"
            >
              Browse Books
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-blue-800 font-semibold py-3 px-6 rounded-md transition duration-300 transform hover:scale-105"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Library Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 transform transition duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800">Digital Borrowing</h3>
              </div>
              <p className="text-gray-600">
                Borrow books online with a simple click and enjoy a 14-day borrowing period with automatic due date tracking.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 transform transition duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800">Due Date Reminders</h3>
              </div>
              <p className="text-gray-600">
                Receive email notifications 2 days and 1 day before your books are due to avoid late fees.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 transform transition duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800">User Dashboard</h3>
              </div>
              <p className="text-gray-600">
                Track your borrowed books, view due dates, and manage returns all from your personalized dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 bg-gray-50 rounded-lg mb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Books</h2>
            <Link
              to="/books"
              className="text-blue-600 hover:text-blue-800 font-medium transition duration-300"
            >
              View All Books →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookCopy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No books available yet.</p>
              <p className="text-gray-400">Check back later for our featured collection.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-800 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Create Account</h3>
              <p className="text-gray-600">
                Sign up for a free account to access our full library catalog.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-800 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Borrow Books</h3>
              <p className="text-gray-600">
                Find books you love and borrow them with a 14-day lending period.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-800 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Return on Time</h3>
              <p className="text-gray-600">
                Return books on time to avoid a ₹5 per day fine for late returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-12 rounded-lg shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of readers who have already discovered their next favorite book.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;