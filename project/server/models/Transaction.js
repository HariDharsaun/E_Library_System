import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 14); // 14 days from now
      return date;
    }
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['issued', 'returned'],
    default: 'issued'
  },
  fine: {
    type: Number,
    default: 0
  },
  finePaid: {
    type: Boolean,
    default: false
  },
  notificationSent: {
    oneDay: { type: Boolean, default: false },
    twoDays: { type: Boolean, default: false }
  }
});

// Calculate fine amount based on return date
transactionSchema.methods.calculateFine = function() {
  if (this.status === 'returned' && this.returnDate > this.dueDate) {
    const daysLate = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    this.fine = daysLate * 5; // ₹5 per day
    return this.fine;
  }
  return 0;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;