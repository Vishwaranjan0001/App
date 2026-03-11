import express from "express";
import multer from "multer";
import path from "path";
import { createDonation, getDonations, getDonationById, deleteDonation, claimDonation } from "../controllers/donation.js"
import protect from "../middlewares/jwt_auth.js"

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

router.get("/", protect, getDonations);
router.get("/:id", protect, getDonationById);
router.post("/create", protect, upload.array("images", 3), createDonation);
router.post("/:id/claim", protect, claimDonation);
router.delete("/:id", protect, deleteDonation)

export default router;