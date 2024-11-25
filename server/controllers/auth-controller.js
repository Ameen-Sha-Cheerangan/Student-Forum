const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); // Load environment variables

const app = express();
const jwtSecret = process.env.JWT_SECRET || '123';

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await new UserModel({
      username,
      password,
    });
    // Hash the user's password before saving
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // Generate a JSON Web Token (JWT) for the new user
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: '1d',
    });

    res.status(201).json({ success: true, token: token, user: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Wrong password ' });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: '3h',
    });

    res.status(200).json({
      success: true,
      isMatch,
      token: token,
      username: username,
      userId: user._id,
    });
  } catch {
    res.status(404).json({ success: false, error: 'Wrong username' });
  }
};
