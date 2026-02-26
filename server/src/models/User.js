import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, sparse: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model('User', userSchema);
