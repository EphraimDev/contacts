import { validationResult } from 'express-validator';

class BaseValidator {
  static validate(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = [];

    errors
      .array()
      .forEach((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({status: false, message: 'validation failed', error: extractedErrors})
  }
}

export default BaseValidator;
