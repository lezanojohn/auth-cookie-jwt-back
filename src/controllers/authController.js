import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDbPath = path.join(__dirname, "..", "users.json");
const users = JSON.parse(fs.readFileSync(userDbPath, "utf8"));

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).send("Usuario no encontrado.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send("Contraseña incorrecta.");
  }

  const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "strict",
  });
  res.send("Inicio de sesión exitoso.");
};

const refreshAccessToken = (req, res) => {
  const token = req.cookies["access_token"];
  if (!token) {
    return res.status(401).send("No se proporcionó token de acceso.");
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "default_secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).send("Token de acceso inválido.");
      }

      // Crear un nuevo token de acceso
      const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("access_token", newToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.send("Token de acceso actualizado con éxito.");
    }
  );
};

const logout = async (req, res) => {
  res.clearCookie("access_token"); // Asume que tu cookie se llama 'access_token'
  res.status(200).send({ message: "Logout successful" });
};

const validateSession = async (req, res) => {
  try {
    const user = jwt.verify(
      req.cookies["access_token"],
      process.env.JWT_SECRET
    );
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid session" });
  }
};

export { loginUser, refreshAccessToken, logout, validateSession };
