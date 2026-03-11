import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/database.js"
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import healthRoutes from "./routes/health.js"
import userRoutes from "./routes/user.js"
import ngoRoutes from "./routes/ngo.js"
import donationRoutes from "./routes/donation.js"
import feedbackRoutes from "./routes/feedback.js"

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/health",healthRoutes);
app.use("/api/user",userRoutes);
app.use("/api/ngo",ngoRoutes);
app.use("/api/donation",donationRoutes);
app.use("/api/feedback",feedbackRoutes);
connectDB();

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})