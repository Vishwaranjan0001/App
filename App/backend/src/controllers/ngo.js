import NGO from "../models/ngo.js";
import bycrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

export const registerNGO = async (req, res) => {
    const { name, email, password, location , capacity } = req.body;

    if (!name || !email || !password || !location || !capacity)
        return res.status(400).json({ message: "All fields Required" });

    const userExists = await NGO.findOne({ email });
    if (userExists)
        return res.status(400).json({ message: "User Already Exists" });

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const user = await NGO.create({
        name,
        email,
        password: hashedPassword,
        location,
        capacity
    });

    const token = await generateToken(user._id);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token
    });
};

export const loginNGO = async (req, res) => {
    const { email, password } = req.body;

    const user = await NGO.findOne({ email });
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

// add a wishlist link for the authenticated NGO
export const addWishlistLink = async (req, res) => {
    if (req.role !== "ngo") {
        return res.status(403).json({ message: "Only NGOs may add wishlists" });
    }

    const { title, url } = req.body;
    if (!title || !url) {
        return res.status(400).json({ message: "Title and URL are required" });
    }

    const ngo = await NGO.findById(req.user._id);
    ngo.wishlists.push({ title, url });
    await ngo.save();

    res.status(201).json({ wishlists: ngo.wishlists });
};

// retrieve wishlists
// * donors (or any other authenticated user) get every NGO's wishlist item
// * ngos receive only their own list so that an empty account doesn't show other NGOs'
export const getAllWishlists = async (req, res) => {
    // if the caller is an NGO, return just that NGO's data
    if (req.role === "ngo") {
        const ngo = await NGO.findById(req.user._id, "wishlists");
        // return the raw wishlist array (no flattening needed)
        return res.json(ngo ? ngo.wishlists : []);
    }

    // otherwise (donor/other) hand back every item in the system
    const ngos = await NGO.find({}, "name wishlists");
    // flatten into array with ngo info
    const result = [];
    ngos.forEach(n => {
        n.wishlists.forEach(w => {
            result.push({ ngo: n.name, ngoId: n._id, title: w.title, url: w.url });
        });
    });
    res.json(result);
};
