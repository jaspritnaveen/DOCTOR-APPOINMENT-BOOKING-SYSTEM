import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "25d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // Check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error, Try again",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    try {
      const patient = await User.findOne({ email });
      const doctor = await Doctor.findOne({ email });

      if (patient) {
        user = patient;
      }
      if (doctor) {
        user = doctor;
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials" });
      }

      const token = generateToken(user);

      const responseData = {
        status: true,
        message: "Successfully login",
        token,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          // Add other fields you want to include
        },
      };

      res.status(200).json(responseData);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Internal Server Error");
  }
};
