import React, { useState, useEffect } from 'react';
import { getUserBooks, returnBook, payFine } from '../api/bookService';
import { getUserTransactions } from '../api/userService';
import { Transaction } from '../types';
import { format, isPast, differenceInDays } from 'date-fns';
import { Book, Calendar, AlertCircle, CheckCircle, ArrowLeft, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBooksPage: React.FC = () => {
  const [currentBooks, setCurrentBooks] = useState<Transaction[]>([]);
  const [pastBooks, setPastBooks] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [processingReturn, setProcessingReturn] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        setLoading(true);
        
        // Get current books (checked out)
        const current = await getUserBooks();
        setCurrentBooks(current);
        
        // Get all transactions (including returned)
        const allTransactions = await getUserTransactions();
        const past = allTransactions.filter(t => t.status === 'returned');
        setPastBooks(past);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load your books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  const handleReturn = async (transactionId: string) => {
    try {
      setProcessingReturn(transactionId);
      await returnBook(transactionId);
      
      // Update the local state to reflect changes
      const transaction = currentBooks.find(t => t._id === transactionId);
      if (transaction) {
        // Remove from current books
        setCurrentBooks(currentBooks.filter(t => t._id !== transactionId));
        
        // Add to past books with status updated
        const returnedTransaction = {
          ...transaction,
          status: 'returned' as 'returned',
          returnDate: new Date().toISOString()
        };
        setPastBooks([returnedTransaction, ...pastBooks]);
      }
      
      toast.success('Book returned successfully');
      setActiveTab('past');
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to return book. Please try again.');
    } finally {
      setProcessingReturn(null);
    }
  };

  const handlePayFine = async (transactionId: string) => {
    try {
      setProcessingPayment(transactionId);
      await payFine(transactionId);
      
      // Update local state to reflect payment
      setPastBooks(pastBooks.map(book => 
        book._id === transactionId ? { ...book, finePaid: true } : book
      ));
      
      toast.success('Fine paid successfully');
    } catch (error) {
      console.error('Error paying fine:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    
    if (isPast(due)) {
      return -differenceInDays(today, due);
    }
    
    return differenceInDays(due, today);
  };

  const renderStatusBadge = (transaction: Transaction) => {
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    const isOverdue = isPast(dueDate);
    const daysRemaining = calculateDaysRemaining(transaction.dueDate);
    
    if (isOverdue) {
      return (
        <div className="flex items-center space-x-1 text-red-600 font-medium">
          <AlertCircle className="h-4 w-4" />
          <span>Overdue by {Math.abs(daysRemaining)} days</span>
        </div>
      );
    }
    
    if (daysRemaining <= 2) {
      return (
        <div className="flex items-center space-x-1 text-amber-600 font-medium">
          <AlertCircle className="h-4 w-4" />
          <span>{daysRemaining === 0 ? 'Due today' : `Due in ${daysRemaining} days`}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1 text-green-600">
        <Calendar className="h-4 w-4" />
        <span>{daysRemaining} days remaining</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Books</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'current'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('current')}
        >
          Current Books
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'past'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Reading History
        </button>
      </div>
      
      {activeTab === 'current' && (
        <div>
          {currentBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {currentBooks.map((transaction) => {
                const book = typeof transaction.book === 'object' ? transaction.book : null;
                if (!book) return null;
                
                return (
                  <div key={transaction._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      {/* Book Cover */}
                      <div className="md:w-1/5 p-4">
                        <img
                          src={book.coverImage || "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"}
                          alt={book.title}
                          className="w-full h-48 md:h-full object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Book Details */}
                      <div className="md:w-4/5 p-4 md:p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h2>
                        <p className="text-gray-600 mb-4">by {book.author}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-4">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Book className="h-4 w-4" />
                            <span>Borrowed on: {format(new Date(transaction.issueDate), 'PP')}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Due date: {format(new Date(transaction.dueDate), 'PP')}</span>
                          </div>
                          <div className="md:col-span-2">
                            {renderStatusBadge(transaction)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleReturn(transaction._id)}
                          disabled={!!processingReturn}
                          className={`flex items-center space-x-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300
                            ${processingReturn === transaction._id ? 'opacity-75 cursor-wait' : ''}`}
                        >
                          {processingReturn === transaction._id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <ArrowLeft className="h-4 w-4" />
                              <span>Return Book</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Borrowed</h3>
              <p className="text-gray-500 mb-6">You haven't borrowed any books yet.</p>
              <a
                href="/books"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse Books
              </a>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'past' && (
        <div>
          {pastBooks.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pastBooks.map((transaction) => {
                      const book = typeof transaction.book === 'object' ? transaction.book : null;
                      if (!book) return null;
                      
                      const isLate = transaction.fine > 0;
                      
                      return (
                        <tr key={transaction._id}>
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
                            {format(new Date(transaction.issueDate), 'PP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(transaction.dueDate), 'PP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.returnDate 
                              ? format(new Date(transaction.returnDate), 'PP')
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isLate ? (
                              <span className="text-sm text-red-600 font-medium">
                                ₹{transaction.fine}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">No fine</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isLate && !transaction.finePaid ? (
                              <button
                                onClick={() => handlePayFine(transaction._id)}
                                disabled={!!processingPayment}
                                className={`inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full
                                  ${processingPayment === transaction._id ? 'opacity-75 cursor-wait' : ''}`}
                              >
                                {processingPayment === transaction._id ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 border-2 border-red-800 rounded-full border-t-transparent"></div>
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="h-3 w-3" />
                                    <span>Pay Fine</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                <CheckCircle className="h-3 w-3" />
                                <span>Completed</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reading History</h3>
              <p className="text-gray-500 mb-6">You haven't returned any books yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;