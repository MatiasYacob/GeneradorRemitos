import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function getRole(req) {
  try {
    const token = req.cookies?.jwt; // suponiendo que usas cookie-parser
    if (!token) return false;

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    // Aquí usas directamente isadmin del token
    if (typeof decoded.isadmin === "boolean") {
      return decoded.isadmin ? "admin" : "user";
    }

    return false;
  } catch (error) {
    console.error("Error validando token:", error);
    return false;
  }
}

function AdminAuthorization(req, res, next) {
  const role = getRole(req);
  if (role === "admin") {
    return next();
  } else {
    return res.status(403).json({ status: "error", message: "Quien te conoce papa?" });
  }
}

function PublicAuthorization(req, res, next) {
  return next();
}

export const methods = {
  AdminAuthorization,
  PublicAuthorization,
};
