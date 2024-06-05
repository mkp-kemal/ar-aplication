import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

const haditsSchema = mongoose.Schema({
  no_hadith: {
    type: Number,
    required: true,
  },
  rawi: {
    type: String,
    required: true,
  },
  sanad: {
    type: [String],
    required: true,
  },
  matan: {
    arabic: {
      type: String,
      required: true,
    },
    translation: {
      type: String,
      required: true,
    },
  },
  reference: {
    type: [String, Number],
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});
const Hadits = mongoose.model('hadits_info', haditsSchema)

export default Hadits