import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, purchaseBook } from '../api/bookService';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Users, Calendar, CheckCircle, XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);

        if (id) {
          const data = await getBookById(id);
          setBook(data);
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please log in to borrow books');
      navigate('/login');
      return;
    }

    if (!book || !book._id) {
      toast.error('Book information is missing');
      return;
    }

    if (book.available <= 0) {
      toast.error('This book is currently not available for borrowing');
      return;
    }

    try {
      setPurchasing(true);
      await purchaseBook(book._id);
      
      // Update local book data to reflect the change in availability
      setBook(prev => {
        if (!prev) return null;
        return {
          ...prev,
          available: prev.available - 1
        };
      });
      
      toast.success('Book borrowed successfully! Due date is 14 days from now.');
    } catch (err: any) {
      console.error('Error purchasing book:', err);
      toast.error(err.response?.data?.message || 'Failed to borrow this book. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Error</h3>
        <p className="text-gray-500 mb-6">{error || 'Book not found'}</p>
        <button
          onClick={() => navigate('/books')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/books')}
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition duration-300"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Books
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 p-6">
            <div className="relative h-[400px] md:h-full">
              <img
                src={book.coverImage || "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Availability Badge */}
              <div className={`absolute top-4 right-4 rounded-full px-3 py-1 font-semibold 
                ${book.available > 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'}`}>
                {book.available > 0 ? 'Available' : 'Not Available'}
              </div>
            </div>
          </div>
          
          {/* Book Details */}
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">ISBN: {book.isbn}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{book.available}/{book.quantity} Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">14 Days Lending Period</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
            </div>
            
            <div className={`flex items-center space-x-2 mb-6 
              ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {book.available > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>This book is available for borrowing</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span>Currently unavailable. Check back later.</span>
                </>
              )}
            </div>
            
            <button
              onClick={handlePurchase}
              disabled={!book.available || purchasing}
              className={`w-full md:w-auto flex items-center justify-center space-x-2 py-3 px-6 rounded-md text-white font-medium transition duration-300
                ${book.available > 0 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {purchasing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  <span>Borrow This Book</span>
                </>
              )}
            </button>
            
            {!user && (
              <p className="mt-2 text-sm text-gray-500">
                You need to <a href="/login" className="text-blue-600 hover:underline">log in</a> to borrow books.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;