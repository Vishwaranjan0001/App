import User from "../models/user.js";
import bycrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password || !location)
        return res.status(400).json({ message: "All fields Required" });

    const userExists = await User.findOne({ email });
    if (userExists)
        return res.status(400).json({ message: "User Already Exists" });

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        location
    });

    const token = await generateToken(user._id);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Invalid Credentials" });

    const token = await generateToken(user._id);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token
    });
}