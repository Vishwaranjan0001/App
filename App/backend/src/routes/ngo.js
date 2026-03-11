import express from "express";
import { registerNGO, loginNGO, addWishlistLink, getAllWishlists } from "../controllers/ngo.js";
import protect from "../middlewares/jwt_auth.js";

const router = express.Router();

router.post("/register" , registerNGO);
router.post("/login" , loginNGO);

// wishlists
router.post("/wishlist", protect, addWishlistLink); // NGO only
router.get("/wishlists", protect,getAllWishlists); // public access

export default router;