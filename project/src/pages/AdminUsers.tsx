import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, getUserTransactions } from '../api/userService';
import { User, Transaction } from '../types';
import { format, isPast } from 'date-fns';
import { ChevronLeft, Search, User as UserIcon, Calendar, Book, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        // Fetch all transactions
        const transactionsData = await getUserTransactions();
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load users data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTransactionsByUserId = (userId: string) => {
    return transactions.filter(transaction => 
      (typeof transaction.user === 'string' && transaction.user === userId) ||
      (typeof transaction.user === 'object' && transaction.user.id === userId)
    );
  };

  const getActiveTransactions = (userId: string) => {
    return getUserTransactionsByUserId(userId).filter(
      transaction => transaction.status === 'issued'
    );
  };

  const getOverdueTransactions = (userId: string) => {
    return getUserTransactionsByUserId(userId).filter(transaction => {
      const dueDate = new Date(transaction.dueDate);
      return transaction.status === 'issued' && isPast(dueDate);
    });
  };

  const toggleExpandUser = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="text-blue-600 hover:text-blue-800 mr-4">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Users List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Books</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => {
                  const activeTransactions = getActiveTransactions(user.id);
                  const overdueTransactions = getOverdueTransactions(user.id);
                  const isExpanded = expandedUser === user.id;
                  
                  return (
                    <React.Fragment key={user.id}>
                      <tr className={isExpanded ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.createdAt), 'PP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{activeTransactions.length}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {overdueTransactions.length > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {overdueTransactions.length} Overdue
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleExpandUser(user.id)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                <span>View</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded view */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="rounded-md border border-gray-200 overflow-hidden">
                              <div className="bg-gray-100 px-4 py-2 font-medium text-gray-700">
                                User's Books
                              </div>
                              
                              {activeTransactions.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                  {activeTransactions.map(transaction => {
                                    const book = typeof transaction.book === 'object' ? transaction.book : null;
                                    if (!book) return null;
                                    
                                    const dueDate = new Date(transaction.dueDate);
                                    const isOverdue = isPast(dueDate);
                                    
                                    return (
                                      <div key={transaction._id} className="px-4 py-3 flex items-center">
                                        <div className="h-12 w-12 flex-shrink-0">
                                          <img
                                            className="h-12 w-12 rounded object-cover"
                                            src={book.coverImage || "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg"}
                                            alt={book.title}
                                          />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                          <div className="font-medium text-gray-900">{book.title}</div>
                                          <div className="text-sm text-gray-500">{book.author}</div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                          <div className="flex items-center space-x-1">
                                            <Book className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-500">
                                              Borrowed: {format(new Date(transaction.issueDate), 'PP')}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                              Due: {format(dueDate, 'PP')}
                                              {isOverdue && ' (Overdue)'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="px-4 py-3 text-center text-gray-500">
                                  No active books for this user
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? `No results for "${searchTerm}"` : 'There are no users in the system yet.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;