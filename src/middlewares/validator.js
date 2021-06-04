import { body } from 'express-validator';
import BaseValidator from '../utils/validator';

class Validators extends BaseValidator {
  static validateSignUpRequest() {
    return [
      body('name').isString().withMessage('Your name is missing'),
      body('email').isEmail().withMessage('Provide a valid email'),
      body('password').isString().withMessage('Your password is missing'),
      body('username').isString().withMessage('Your username is missing')
    ];
  }

  static validateContactRequest() {
    return [
      body('email').isEmail().optional({ nullable: true }).withMessage('Provide a valid email'),
      body('name').isString().withMessage('Contact name is missing'),
      body('phoneNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
      body('address').isString().optional({ nullable: true }).withMessage('Provide a valid address')
    ];
  }

  static validateLoginForm() {
    return [
      body('username').isString().withMessage('Provide a valid username or email'),
      body('password').isString().withMessage('Provide a valid password')
    ];
  }

  static validateForgotPasswordRequest() {
    return [
      body('username').isString().withMessage('Your username field is missing')
    ];
  }

  static validateChangePasswordRequest() {
    return [
      body('username').isString().withMessage('Your username field is missing'),
      body('newPassword').isString().withMessage('Your password field is missing'),
      body('token').isString().withMessage('Your otp field is missing'),
    ];
  }
}

export default Validators;
