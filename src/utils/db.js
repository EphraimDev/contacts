import mongoose from 'mongoose';
import logger from './logger';

mongoose.Promise = global.Promise;

const uri =
  process.env.NODE_ENV === 'test'
    ? `mongodb://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASS}@${process.env.TEST_DB_SERVER}/${process.env.TEST_DB_NAME}`
    : `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}/${process.env.DB_NAME}`;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
const connection = mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

connection
  .then((db) => {
    logger.info(`Successfully connected to ${uri} MongoDB cluster in ${env} mode.`);
    return db;
  })
  .catch((err) => {
    if (err.message.code === 'ETIMEDOUT') {
      logger.info('Attempting to re-establish database connection.');
      mongoose.connect(uri);
    } else {
      logger.error('Error while attempting to connect to database:');
      logger.error(err);
    }
  });

export default connection;
