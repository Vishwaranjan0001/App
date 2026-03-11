import express from "express"

const router = express.Router();

router.get("/", (req, res) => {
    res.json("Server is running");
})

export default router;