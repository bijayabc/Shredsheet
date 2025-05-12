const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createHash, validatePassword } = require('./authController');

const getUserInfo = async (req, res) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const auth_token = req.headers.authorization.split('Bearer ')[1];

    // Verify the token
    const { userId, email } = jwt.verify(auth_token, process.env.MY_SECRET_KEY);

    // Find user but exclude password from the response
    const user = await User.findById(userId)
      .select('-password')
      .populate({
        path: 'workouts',
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: 'routines',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    res.json({ success: true, user });

  } catch (error) {
    // Handle different types of errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    console.error('User info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const updateUserInfo = async (req, res) => {
  const { name, email, newPassword, confirmPassword } = req.body;

  try {
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Prepare update object
    const updateData = {
      name,
      email
    };

    // Handle password update if provided
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match!" });
      }
      
      // Validate password strength
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
          return res.status(400).json({ error: passwordError });
      }

      updateData.password = await createHash(newPassword);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true } // Return updated document
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userData: updatedUser
    });

  } catch (error) {
    console.error("Couldn't update user information:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: "Failed to update profile"
    });
  }
};

module.exports = {
    getUserInfo,
    updateUserInfo
}