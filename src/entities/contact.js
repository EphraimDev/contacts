import mongoose, { Schema } from 'mongoose';
import User from './user';

export const ContactSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phoneNumber: [
      {
        type: String,
        trim: true,
        required: true
      }
    ],
    name: {
      type: String,
      trim: true,
      required: true
    },
    address: {
      type: String,
      trim: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true
    }
  },
  { collection: 'contacts', timestamps: true }
);

export default mongoose.model('Contact', ContactSchema);
