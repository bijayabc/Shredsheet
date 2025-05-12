const bcrypt = require('bcrypt') // To hash password
const jwt = require('jsonwebtoken'); // To generate auth token
const User = require('../models/user');

SALT_ROUNDS = 10
async function createHash(password) {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters long!";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter!";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter!";
  if (!/\d/.test(password)) return "Password must contain at least one number!";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character!";
  return null;
};

const registerUser = async (req, res) => {
  const { name, email, weight, dob, password, confirmPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password || !weight || !dob) {
    return res.status(400).json({ error: "Inputs cannot be empty!" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Validate password strength
  const passwordError = validatePassword(password);
  if (passwordError) {
      return res.status(400).json({ error: passwordError });
  }

  try {
    const hashedPassword = await createHash(password);

    const user = new User({ ...req.body, password: hashedPassword });

    await user.save();

    return res.status(201).json({ success: true });
  } catch (error) {
      if (error.code === 11000) {
      return res.status(400).json({
        error: "This email is already registered. Please use a different email or login.",
      });
    }

  return res.status(500).json({ error: "Internal server error." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // If user is not found, send error message
      return res.status(401).json({ error: "User not found!" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Incorrect password!" });
    }
    

    const payload = { userId: user.id, email: user.email }
    const token = jwt.sign(payload, process.env.MY_SECRET_KEY) // Generate a JWT token
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      success: true,
      user: userWithoutPassword,
      auth_token: token
    })


  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

module.exports = {
    registerUser,
    loginUser,
    createHash,
    validatePassword
}