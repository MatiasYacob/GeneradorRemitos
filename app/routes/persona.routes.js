import { Router } from "express";
import pool from "../database.js";

const router = Router();

router.get("/list", async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * FROM users");
        console.log("Personas fetched successfully:", result);
        res.render("users/list",{personas: result})
    } catch (error) {
        console.error("Error fetching personas:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
