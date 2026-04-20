import bcrypt from "bcrypt";

export const hashData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
};

export const compareData = async (input, hashed) => {
  return bcrypt.compare(input, hashed);
};
