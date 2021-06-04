/**
 * A simple CRUD controller for contacts
 * Create the necessary controller methods
 */

import logger from '../utils/logger';
import Contact from '../entities/contact';

export default {
  // get all contacts for a user
  all: async (req, res) => {
    let response;
    try {
      const user = req.user;

      const contacts = await Contact.find({ user: user._id });

      response = { contacts, message: 'contacts retrieved successfully', status: true };
      logger.info(response);
      return res.status(200).json(response);
    } catch (error) {
      response = { message: 'contacts retrieval failed', error: error.message, status: false };
      logger.error(response);
      return res.status(500).json(response);
    }
  },
  // get a single contact
  get: async (req, res) => {
    let response;
    try {
      const { id } = req.params;

      const contact = await Contact.findById(id);

      if (!contact) {
        response = { message: 'contact does not exist', status: false };
        logger.error(response);
        return res.status(404).json(response);
      }

      response = { contact, message: 'contact retrieved successfully', status: true };
      logger.info(response);
      return res.status(200).json(response);
    } catch (error) {
      response = { message: 'contact retrieval failed', error: error.message, status: false };
      logger.error(response);
      return res.status(500).json(response);
    }
  },
  // create a single contact
  create: async (req, res) => {
    let response;
    try {
      const { name, email, phoneNumber, address } = req.body;
      const user = req.user;

      let contact = await Contact.findOne({ user: user._id, name });

      if (contact) {
        if (contact.phoneNumber.indexOf(phoneNumber) >= 0) {
          response = { message: 'this phone number already exist for this contact', status: false };
          logger.error(response);
          return res.status(400).json(response);
        } else {
          contact.phoneNumber.push(phoneNumber);
          await contact.save();
        }
      } else {
        contact = new Contact();
        contact.name = name;
        contact.email = email;
        contact.phoneNumber = phoneNumber;
        contact.address = address;
        contact.user = user._id;
        await contact.save();
      }

      response = { contact, message: 'successful', status: true };
      logger.info(contact);
      return res.status(201).json(response);
    } catch (error) {
      response = { message: 'contact creation failed', error: error.message, status: false };
      logger.error(response);
      return res.status(500).json(response);
    }
  },
  // update a single contact
  update: async (req, res) => {
    let response;
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, address } = req.body;

      let contact = await Contact.findOne({ user: req.user._id, _id: id });

      if (!contact) {
        response = { message: 'contact does not exist', status: false };
        logger.error(response);
        return res.status(404).json(response);
      }

      contact.name = name;
      contact.email = email ? email : contact.email;
      contact.address = address ? address : contact.address;

      if (contact.phoneNumber.indexOf(phoneNumber) === -1) {
        contact.phoneNumber.push(phoneNumber);
      }
      await contact.save();

      response = { contact, message: 'successful', status: true };
      logger.info(response);
      return res.status(200).json(response);
    } catch (error) {
      response = { message: 'contact update failed', error: error.message, status: false };
      logger.error(response);
      return res.status(500).json(response);
    }
  },
  // remove a single contact
  remove: async (req, res) => {
    let response;
    try {
      const { id } = req.params;

      const contact = await Contact.findOne({ user: req.user._id, _id: id });

      if (!contact) {
        response = { message: 'contact does not exist', status: false };
        logger.error(response);
        return res.status(404).json(response);
      }

      await contact.delete();

      response = { message: 'contact removed successfully', status: true };
      logger.info(response);
      return res.status(200).json(response);
    } catch (error) {
      response = { message: 'contact delete failed', error: error.message, status: false };
      logger.error(response);
      return res.status(500).json(response);
    }
  }
};
