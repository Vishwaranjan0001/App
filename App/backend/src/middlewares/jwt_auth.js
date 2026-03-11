import User from "../models/user.js"
import NGO from "../models/ngo.js"
import jwt from "jsonwebtoken"

// middleware that works for both donor users and NGOs
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // attempt to load regular user
            let account = await User.findById(decoded.id).select("-password");
            if (account) {
                req.user = account;
                req.role = "user";
                return next();
            }

            // attempt to load NGO account
            account = await NGO.findById(decoded.id).select("-password");
            if (account) {
                req.user = account;
                req.role = "ngo";
                return next();
            }

            res.status(401).json({ message: "Not Authorised, account not found" });
        } catch (err) {
            res.status(401).json({ message: "Not Authorised , token failed" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not Authorised , no token" });
    }
}

export default protect;