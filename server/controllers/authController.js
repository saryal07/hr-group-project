// controllers/authController.js
const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  // Find user
  const user = await Employee.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid password');
  }

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
});

const registerEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const emailExists = await Employee.findOne({ email });
  if (emailExists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await Employee.create({
    email,
    password,
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
    }
  });
});

module.exports = { registerEmployee, loginEmployee };