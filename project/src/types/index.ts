export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isbn: string;
  quantity: number;
  available: number;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  user: string | User;
  book: string | Book;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'borrowed';
  fine: number;
  finePaid: boolean;
  notificationSent: {
    oneDay: boolean;
    twoDays: boolean;
  };
}