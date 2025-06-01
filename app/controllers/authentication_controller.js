import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import  pool  from "../database.js";

dotenv.config();


//Login function

async function login(req, res) {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE name = ?", [user]);

        if (rows.length === 0) {
            return res.status(400).json({ status: "error", message: "Usuario o contraseña incorrectos" });
        }

        const userFromDB = rows[0];

        const passwordMatch = await bcrypt.compare(password, userFromDB.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: "error", message: "Usuario o contraseña incorrectos" });
        }

        const token = jwt.sign(
            {
                id: userFromDB.id,
                name: userFromDB.name,
                isadmin: !!userFromDB.is_admin
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
            path: "/",
            httpOnly: true,
            sameSite: "lax"
        };

        res.cookie("jwt", token, cookieOption);

        res.send({
            status: "success",
            message: "Login exitoso",
            redirect: userFromDB.is_admin ? "/admin" : "/"
        });

    } catch (error) {
        console.error("Error al hacer login:", error);
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
}

//Register function

async function register(req, res) {
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const [existing] = await pool.query("SELECT * FROM users WHERE name = ?", [user]);
    if (existing.length > 0) {
        return res.status(400).json({ status: "error", message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
        "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)",
        [user, email, hashedPassword, false]
    );

    return res.status(201).json({
        status: "success",
        message: "User created successfully",
        redirect: "/"
    });

}


//Logout function

async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ status: "success", message: "Logout success", redirect: "/" });
}

export const methods = {
    login,
    register,
    logout
};
