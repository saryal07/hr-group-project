const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const TokenModel = require('../models/TokenModel');

const checkRegistrationToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Look up token in DB
  const tokenRecord = await TokenModel.findOne({ token });

  if (!tokenRecord) {
    res.status(400);
    throw new Error('Token not found');
  }

  if (tokenRecord.used) {
    res.status(400);
    throw new Error('Token already used');
  }

  if (tokenRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Token expired');
  }

  res.status(200).json({ email: tokenRecord.email });
});

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
      username: user.username,
      role: user.role,
    }
  });
});

const registerEmployee = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const tokenRecord = await TokenModel.findOne({ token });

   if (!tokenRecord) {
    res.status(400);
    throw new Error('Invalid token');
  }

  if (tokenRecord.used) {
    res.status(400);
    throw new Error('Token has already been used');
  }

  if (tokenRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error('Token has expired');
  }

  const email = tokenRecord.email;
  const existing = await Employee.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error('Email already registered');
  }

  // Create the employee account
  const user = await Employee.create({
    email,
    username,
    password,
  });

  // Mark token as used
  tokenRecord.used = true;
  await tokenRecord.save();

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    }
  });
});

module.exports = { checkRegistrationToken, registerEmployee, loginEmployee };