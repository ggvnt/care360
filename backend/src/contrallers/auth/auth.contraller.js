import User from "../../models/auth/user.models.js";
import { generateToken } from "../../lib/utils.js";

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { 
    email, 
    password, 
    confirmPassword, 
    firstName, 
    lastName, 
    role,
    sex,
    location,
    phone,
    age
  } = req.body;

  try {
    // Check required fields
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email,
      firstName,
      lastName,
      password,
      role: role || "user",
      sex: sex || "", // Add sex with default empty string
      location: location || "", // Add location with default empty string
      phone: phone || "", // Add phone with default empty string
      age: age || "" 
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      role: newUser.role,
      sex: newUser.sex, // Include sex in response
      location: newUser.location, // Include location in response
      phone: newUser.phone, // Include phone in response
      age: newUser.age
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res, user.role);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, location, phone, bio } = req.body;
    const userId = req.user._id;

    let updatedFields = {
      firstName,
      lastName,
      location,
      phone,
      bio
    };

    // Handle file upload if present
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        max_file_size: 5 * 1024 * 1024,
        resource_type: "image",
      });
      updatedFields.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select('-password'); // Exclude password from response

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};