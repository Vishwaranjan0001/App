import Donation from "../models/donation.js"
import transporter from "../utils/mailTransporter.js";
import Ngo from "../models/ngo.js";

export const createDonation = async (req, res, next) => {
  try {
    // accept optional radiusKm from client
    const { radiusKm = 10, location, capacity, foodDesc, pickupTime } = req.body;

    // basic validation
    if (!location || capacity == null || !foodDesc || !pickupTime) {
      return res.status(400).json({ message: "Missing donation fields" });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // create the donation record first
    const donation = await Donation.create({
      user: req.user._id,
      location,
      capacity,
      foodDesc,
      pickupTime,
      status: false,
      images
    });

    // get donor coordinates
    const { lat: donorLat, lng: donorLng } = parseCoords(donation.location);

    // fetch ngos with a location defined
    const ngos = await Ngo.find({
      location: { $exists: true, $ne: null }
    });

    // 1. calculate distance for all NGOs
    const ngosWithDistance = ngos
      .map(ngo => {
        try {
          const { lat, lng } = parseCoords(ngo.location);
          const distance = calculateDistance(donorLat, donorLng, lat, lng);
          return {
            ...ngo.toObject(),
            distance
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    // 2. filter by radius
    const ngosWithinRadius = ngosWithDistance.filter(
      ngo => ngo.distance <= radiusKm
    );

    // 3. sort by capacity match (closest to donation capacity)
    //    tie-breaker → distance
    const sorted = ngosWithinRadius.sort((a, b) => {
      const diffA = Math.abs((a.capacity || 0) - donation.capacity);
      const diffB = Math.abs((b.capacity || 0) - donation.capacity);
      if (diffA !== diffB) return diffA - diffB;
      return a.distance - b.distance;
    });

    // 4. take top 3
    const top3 = sorted.slice(0, 3);

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    for (const ngo of top3) {
      if (!ngo.email) continue;

      const donationLink = `${frontendBaseUrl}/donations/${donation._id}`;

      await transporter.sendMail({
        from: `"NGO Food Finder" <${process.env.MAIL_USER}>`,
        to: ngo.email,
        subject: "New food donation available near you",
        html: `
          <h3>New Food Donation 🍱</h3>

          <p><b>Quantity:</b> ${donation.capacity}</p>
          <p><b>Distance:</b> ${ngo.distance?.toFixed(2)} km</p>

          <p>
            <a href="${donationLink}">
              View donation
            </a>
          </p>
        `
      });
    }

    res.status(201).json({ message: "Donation created", donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDonations = async (req, res) => {
    try {
      let donations;
      if (req.role === 'ngo') {
        // NGOs see only donations they've accepted
        donations = await Donation.find({ reciever: req.user._id }).sort("-createdAt");
      } else {
        // Donors see only their own donations
        donations = await Donation.find({ user: req.user._id }).sort("-createdAt");
      }
      res.json(donations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
}

export const deleteDonation = async (req, res) => {
    const donation = await Donation.deleteOne({ _id: req.params.id });
    res.json({ "message": "Deletion successfull" });
}

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// when an NGO clicks the link they received via email, this endpoint is hit
// it verifies the authenticated user, ensures the donation exists and is still
// available (status=false), then marks it as taken and records the receiver.
export const claimDonation = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorised" });
    }
    if (req.role !== 'ngo') {
      return res.status(403).json({ message: "Only NGOs may claim donations" });
    }

    const donationId = req.params.id;
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // status === false means still available, flip logic as needed
    if (donation.status === true) {
      // already claimed
      return res.status(400).json({ message: "Donation not available" });
    }

    donation.status = true;
    donation.reciever = userId; // record which NGO/user claimed it
    await donation.save();

    res.json({ message: "Donation claimed successfully", donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

function parseCoords(location) {
  // expects "lat,lng"
  const [lat, lng] = location.split(",").map(Number);
  return { lat, lng };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
