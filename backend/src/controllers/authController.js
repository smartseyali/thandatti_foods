const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName, phoneNumber, profilePhoto, description } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      phoneNumber,
      profilePhoto,
      description,
      role: 'customer',
    };

    const user = await User.create(userData);

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Remove password hash from response
    delete user.password_hash;

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { firstName, lastName, phoneNumber, profilePhoto, description } = req.body;

    const userData = {
      firstName,
      lastName,
      phoneNumber,
      profilePhoto,
      description,
    };

    const user = await User.update(req.userId, userData);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    // Since we're using JWT, logout is handled client-side by removing the token
    // However, we can implement token blacklisting here if needed
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
};

