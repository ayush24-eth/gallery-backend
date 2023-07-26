const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  base64: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  isLiked:{
    type: Boolean,
    default: false
  },
  comments: [
    {
      user: {
        type: String,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  tags: {
    type: [String],
    default: []
  },
  uploadDate: { 
    type: Date, 
    required: true 
  },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;