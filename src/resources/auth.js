import Auth from '../controllers/auth';
import Validators from '../middlewares/validator';

module.exports = (app) => {
  app.route('/auth/login').post(Validators.validateLoginForm(), Validators.validate, Auth.login);
  app
    .route('/auth/signup')
    .post(Validators.validateSignUpRequest(), Validators.validate, Auth.signup);

  /*** BONUS POINTS ***/
  app.route('/auth/forgotPassword').post(Validators.validateForgotPasswordRequest(), Validators.validate, Auth.forgotPassword);
  app.route('/auth/changePassword').post(Validators.validateChangePasswordRequest(), Validators.validate, Auth.changePassword);
};
