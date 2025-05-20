import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const usuarios = [{
    user: "admin",
    role: "admin",
    email: "admin",
    password: "$2b$05$DFoYSonr4oayhf.qFEajouelKD9ULcNAUuW5r0JAdxNaak2AbTSNe"
},{
    user: "admin2",
    role: "normal",
    email: "admin",
    password: "$2b$05$DFoYSonr4oayhf.qFEajouelKD9ULcNAUuW5r0JAdxNaak2AbTSNe"
}


];

//Login function

async function login(req, res) {
    console.log(req.body);

    const { user, password } = req.body;
    if (!user || !password) {
        return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const userExists = usuarios.find((u) => u.user === user);
    if (!userExists) {
        return res.status(400).json({ status: "error", message: "User or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
        return res.status(400).json({ status: "error", message: "User or password incorrect" });
    }

    const token = jwt.sign(
        { user: userExists.user },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        path: "/",
        httpOnly: false, // recomendación de seguridad
        sameSite: "lax"
    };

    res.cookie("jwt", token, cookieOption);

    res.send({
        status: "success",
        message: "Login success",
        redirect: "/admin"
    });
}

//Register function

async function register(req, res) {
    console.log(req.body);
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const userExists = usuarios.find((u) => u.user === user);
    if (userExists) {
        return res.status(400).json({ status: "error", message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        user,
        email,
        password: hashedPassword
    };

    usuarios.push(newUser);
    console.log(usuarios);

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
