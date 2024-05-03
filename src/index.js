import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.development" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
