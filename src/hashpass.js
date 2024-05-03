import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const passwords = ["password1", "password2"]; // Estas son las contraseñas originales
passwords.forEach(async (password) => {
  const hashed = await hashPassword(password);
  console.log(`Password: ${password}, Hashed: ${hashed}`);
});
