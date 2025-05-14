import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user transactions
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    // Check if admin or self
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const transactions = await Transaction.find({ user: userId })
      .populate('book')
      .sort({ issueDate: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Get user's pending returns
export const getPendingReturns = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    // Check if admin or self
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const transactions = await Transaction.find({
      user: userId,
      status: 'issued'
    }).populate('book');
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending returns', error: error.message });
  }
};

// Create admin user (seed data)
export const createAdmin = async (req, res) => {
  try {
    // Check if there's already an admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }
    
    const { name, email, password } = req.body;
    
    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin user', error: error.message });
  }
};