import jwt from 'jsonwebtoken';
import User from '../entities/user';
import logger from '../utils/logger';

require('dotenv').config();

export default async (req, res, next) => {
  let response;
  try {
    const authorization = req.header('Authorization');
    if (!authorization) {
      response = { message: 'Authorization token is invalid', status: false };
      logger.error(response);
      return res.status(401).json(response);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      response = { message: 'Authorization token is missing', status: false };
      logger.error(response);
      return res.status(401).json(response);
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      response = { message: 'Failed to authenticate user', status: false };
      logger.error(response);
      return res.status(401).json(response);
    }

    req.user = user;
    next();
  } catch (error) {
    response = { message: 'Failed to authenticate user', error: error.message, status: false };
    logger.error(response);
    return res.status(500).json(response);
  }
};
