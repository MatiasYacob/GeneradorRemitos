import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "../controllers/authentication_controller.js";
dotenv.config();

function getRole(req) {
  const cookieJWT = req.headers.cookie.split("=")[1];
  const cookieDecodificada = jsonwebtoken.verify(
    cookieJWT,
    process.env.JWT_SECRET
  );

  console.log("cookie decodificada", cookieDecodificada);
  const userExists = usuarios.find((u) => u.user === cookieDecodificada.user);
  console.log("userExists role: ", userExists.role);
  
  if (!userExists) {
    return false;
  }
  return userExists.role;
}

function AdminAuthorization(req, res, next) {
  const role = getRole(req);
  if (role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .json({ status: "error", message: "Quien te conoce papa?" });
  }
}

function PublicAuthorization(req, res, next) {
  return next();
}

export const methods = {
  AdminAuthorization,
  PublicAuthorization,
  // Other methods can be added here
};
