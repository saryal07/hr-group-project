const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const loginEmployee = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validate fields
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide both username and password');
  }

  // Find user
  const user = await Employee.findOne({ username });

  if (!user) {
    res.status(401);
    throw new Error('Invalid username');
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
      username: user.username
    }
  });
});

// this mimics receiving email and password from hr
const registerEmployee = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
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
    username,
    password,
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      username: user.username
    }
  });
});

module.exports = { registerEmployee, loginEmployee };