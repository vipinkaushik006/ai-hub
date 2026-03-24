const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // ✅ npm i validator

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: (v) => validator.isEmail(v), // ✅ Proper email format check
        message: 'Please provide a valid email address'
      }
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // ✅ Never returned in queries unless explicitly asked
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
      }
    ],

    avatar: { type: String, default: '', trim: true },

    isActive: { type: Boolean, default: true } // ✅ Soft delete support
  },
  {
    timestamps: true // ✅ createdAt + updatedAt auto-managed
  }
);

// ✅ Hash password only on raw password change (not on other field updates)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ✅ Also hash if password updated via findOneAndUpdate
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 12);
  }
  next();
});

// ✅ Compare plaintext password with stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // password has select:false so must be explicitly fetched
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Add bookmark only if not already saved
UserSchema.methods.addBookmark = async function (toolId) {
  const alreadyBookmarked = this.bookmarks.some((id) => id.equals(toolId));
  if (!alreadyBookmarked) {
    this.bookmarks.push(toolId);
    await this.save();
  }
};

// ✅ Remove bookmark safely
UserSchema.methods.removeBookmark = async function (toolId) {
  this.bookmarks = this.bookmarks.filter((id) => !id.equals(toolId));
  await this.save();
};

// ✅ Clean sensitive + internal fields from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.isActive; // don't expose soft-delete flag to client
  return obj;
};

module.exports = mongoose.model('User', UserSchema);