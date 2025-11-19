import bcrypt from "bcryptjs";

export const comparePassword = (plain, hashed) =>
  bcrypt.compareSync(plain, hashed);
