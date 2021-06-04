import Contact from '../controllers/contact';
import validateToken from '../middlewares/validateToken';
import Validators from '../middlewares/validator';

/**
 *
 *
 */
module.exports = (app) => {
  app.route('/contact/all').get(validateToken, Contact.all);
  app
    .route('/contact/create')
    .post(validateToken, Validators.validateContactRequest(), Validators.validate, Contact.create);
  app
    .route('/contact/update/:id')
    .put(validateToken, Validators.validateContactRequest(), Validators.validate, Contact.update);
  app.route('/contact/single/:id').get(validateToken, Contact.get);
  app.route('/contact/remove/:id').delete(validateToken, Contact.remove);
};
