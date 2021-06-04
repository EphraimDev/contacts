import mongoose, { Schema } from 'mongoose';
import User from './user';

export const OtpSchema = new Schema(
  {
    value: {
      type: String,
      trim: true,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true
    }
  },
  { collection: 'otps', timestamps: true, }
);

export default mongoose.model('Otp', OtpSchema);
