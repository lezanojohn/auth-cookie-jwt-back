import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  const token = req.cookies["access_token"];
  if (!token) {
    return res.status(403).send("Se requiere un token para autenticación");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Token inválido");
  }
};

export default verificarToken;
