import jwt from 'jsonwebtoken';

require('dotenv').config()
const { SECRET_KEY, EXPIRES_IN } = process.env;

export default async (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    time: new Date()
  };

  const token = await jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRES_IN
  });

  return token;
};
