import Feedback from "../models/feedback.js";
import Donation from "../models/donation.js";

// Add feedback with images
export const addFeedback = async (req, res) => {
  try {
    const { donation: donationId, rating, comment } = req.body;
    const ngoId = req.user._id;

    // Validate inputs
    if (!donationId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Verify the donation exists and is accepted by this NGO
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (String(donation.reciever) !== String(ngoId)) {
      return res.status(403).json({ message: "You can only feedback on donations you accepted" });
    }

    // Collect image paths from multer
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    // Create feedback
    const feedback = await Feedback.create({
      donation: donationId,
      ngo: ngoId,
      rating,
      comment,
      images: images.slice(0, 2) // Limit to 2 images
    });

    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedbacks for a donation
export const getDonationFeedbacks = async (req, res) => {
  try {
    const { donationId } = req.params;

    const feedbacks = await Feedback.find({ donation: donationId })
      .populate("ngo", "name email")
      .sort("-createdAt");

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedbacks given by NGO
export const getNGOFeedbacks = async (req, res) => {
  try {
    const ngoId = req.user._id;

    const feedbacks = await Feedback.find({ ngo: ngoId })
      .populate("donation", "foodDesc location capacity pickupTime user")
      .sort("-createdAt");

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
