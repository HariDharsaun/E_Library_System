import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const isAvailable = book.available > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      {/* Book Cover */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={book.coverImage || "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"} 
          alt={book.title}
          className="w-full h-full object-cover"
        />
        {/* Availability Badge */}
        <div className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-semibold 
          ${isAvailable 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'}`}>
          {isAvailable ? 'Available' : 'Not Available'}
        </div>
      </div>
      
      {/* Book Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{book.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span>{`${book.available}/${book.quantity} copies`}</span>
          </div>
          
          <Link 
            to={`/books/${book._id}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition duration-300"
          >
            View Details
          </Link>
        </div>
        
        {/* Status Indicator */}
        <div className={`mt-3 flex items-center text-sm 
          ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
          {isAvailable ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Ready to borrow</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-1" />
              <span>Currently unavailable</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;