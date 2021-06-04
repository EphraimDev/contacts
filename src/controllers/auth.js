import OtpModel from '../entities/otp';
import User from '../entities/user';
import generateToken from '../middlewares/generateToken';
import logger from '../utils/logger';
import sendMail from '../utils/mail';
import { otp, addMinutes } from '../utils/otp';
require('dotenv').config();

/**
 * Given a json request
 * {"username": "<...>", "password": "<...>"}
 * Verify the user is valid and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const login = async (req, res) => {
  let response = null;
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      response = { message: 'user does not exist', status: false };
      logger.error(response);
      return res.status(404).json(response);
    }

    const verifyPassword = user.verifyPasswordSync(password);

    if (!verifyPassword) {
      response = { message: 'incorrect login details', status: false };
      logger.error(response);
      return res.status(400).json(response);
    }

    const token = await generateToken(user);

    response = { user, token, message: 'login successful', status: true };
    logger.info(response);
    return res.status(200).json(response);
  } catch (error) {
    response = { message: 'sign up failed', error: error.message, status: false };
    logger.error(response);
    return res.status(500).json(response);
  }
};
/**
 * Given a json request
 * {"username": "<...>", "password": "<...>"}
 * Create a new user and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const signup = async (req, res) => {
  let response = null;
  try {
    const { name, username, password, email } = req.body;
    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      response = { message: 'user exists already', status: false };
      logger.error(response);
      return res.status(400).json(response);
    }

    user = new User();
    user.name = name;
    user.username = username;
    user.password = password;
    user.email = email;
    await user.save();

    const token = await generateToken(user);

    response = { user, token, message: 'Sign up successful', status: true };
    logger.info(response);
    return res.status(201).json(response);
  } catch (error) {
    response = { message: 'sign up failed', error: error.message, status: false };
    logger.error(response);
    return res.status(500).json(response);
  }
};
/**
 * Implement a way to recover user accounts
 */
export const forgotPassword = async (req, res) => {
  let response = null;
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      response = { message: 'user does not exist', status: false };
      logger.error(response);
      return res.status(404).json(response);
    }

    const token = process.env.NODE_ENV === 'test' ? '111111' : await otp();
    const emailContent = `To change your password, enter this number ${token}. This otp will expire after 5 minutes`;
    await sendMail(user.email, 'Forgot Password', emailContent);

    let userOtp = await OtpModel.findOne({ user: user._id });

    if (!userOtp) {
      userOtp = new OtpModel();
      userOtp.user = user._id;
    }
    userOtp.value = token;

    await userOtp.save();

    response = { message: 'email sent', status: true };
    logger.info(response);
    return res.status(200).json(response);
  } catch (error) {
    response = { message: 'forgot password failed', error: error.message, status: false };
    logger.error(response);
    return res.status(500).json(response);
  }
};

export const changePassword = async (req, res) => {
  let response = null;
  try {
    const { username, token, newPassword } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      response = { message: 'user does not exist', status: false };
      logger.error(response);
      return res.status(404).json(response);
    }

    const userOtp = await OtpModel.findOne({ user: user._id });

    if (!userOtp) {
      response = { message: 'user does not have an otp', status: false };
      logger.error(response);
      return res.status(404).json(response);
    }

    const expiresIn = addMinutes(userOtp.updatedAt, 5);
    if (new Date().getTime() > expiresIn.getTime()) {
      response = { message: 'OTP has expired', status: false };
      logger.error(response);
      return res.status(400).json(response);
    }

	if(userOtp.value != token){
		response = { message: 'OTP does not match', status: false };
		logger.error(response);
		return res.status(400).json(response);
	}

	user.password = newPassword;
	await user.save();

    response = { message: 'password changed successfully', status: true };
    logger.info(response);
    return res.status(200).json(response);
  } catch (error) {
    response = { message: 'password change failed', error: error.message, status: false };
    logger.error(response);
    return res.status(500).json(response);
  }
};

export default {
  login,
  signup,
  forgotPassword,
  changePassword
};
