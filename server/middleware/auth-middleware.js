const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const jwtSecret = process.env.JWT_SECRET || '123';

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("Unauthorizied");
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });// Return a 404 error if the user is not found
    }
    req.user = user;// Attach the user to the request object
    next();//call the next middleware
  } catch (error) {
    return res.json({ error: error.message });
  }
};
